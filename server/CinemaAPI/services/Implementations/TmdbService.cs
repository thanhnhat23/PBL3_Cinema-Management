using CinemaAPI.data;
using CinemaAPI.Services.Interfaces;
using CinemaAPI.Models.DTOs;
using Microsoft.Extensions.Options;
using CinemaAPI.Models;
using CinemaAPI.Services.Implementations;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using System.Text.Json;
using System.Text.Json.Serialization;

public class TmdbService : ITmdbService
{
    private const int MaxSyncPages = 10;

    private readonly HttpClient _httpClient;
    // SQL
    private readonly AppDbContext _dbContext;
    // NoSQL
    private readonly MongoDbContext _mongoDbContext;
    private readonly TmdbConfig _config;
    private readonly ILogger<TmdbService> _logger;

    public TmdbService(
        HttpClient httpClient,
        AppDbContext sqlContext,
        MongoDbContext mongoContext,
        IOptions<TmdbConfig> config,
        ILogger<TmdbService> logger)
    {
        _httpClient = httpClient;
        _dbContext = sqlContext;
        _mongoDbContext = mongoContext;
        _config = config.Value;
        _logger = logger;
    }

    public class NullableDateTimeConverter : JsonConverter<DateTime?>
    {
        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string? dateString = reader.GetString();
            if (string.IsNullOrWhiteSpace(dateString))
            {
                return null;
            }

            if (DateTime.TryParse(dateString, out DateTime result))
            {
                return result;
            }

            return null;
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value.HasValue)
            {
                writer.WriteStringValue(value.Value.ToString("yyyy-MM-dd"));
            }
            else
            {
                writer.WriteNullValue();
            }
        }
    }

    public class DateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string dateString = reader.GetString();

            if (DateTime.TryParse(dateString, out DateTime result))
            {
                return result;
            }

            return DateTime.MinValue;
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("yyyy-MM-dd"));
        }
    }

    public async Task SyncMovieAsync(string endpointType)
    {
        if (_config == null || _config.ConfigEndpoints == null)
            throw new Exception("TmdbConfig is missing in appsettings.json");

        var api_key = _config.ApiKey;

        string endpoint;
        if (endpointType == "upcoming") endpoint = _config.ConfigEndpoints.Upcoming;
        else if (endpointType == "nowplaying") endpoint = _config.ConfigEndpoints.NowPlaying;
        else if (endpointType == "popular") endpoint = _config.ConfigEndpoints.Popular;
        else throw new ArgumentException("Invalid endpointType specified.");

        for (int page = 1; page <= MaxSyncPages; page++)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new NullableDateTimeConverter() }
            };
            var url = $"{endpoint}?api_key={api_key}&language=vi-VN&page={page}";
            var response = await _httpClient.GetFromJsonAsync<MovieResponse>(url, options);

            if (response?.Results != null)
            {
                try
                {
                    var incomingTmdbIds = response.Results
                        .Select(item => item.Id.ToString())
                        .ToHashSet();

                    var existingTmdbIds = await _dbContext.Movies
                        .AsNoTracking()
                        .Where(movie => movie.tmdb_id != null && incomingTmdbIds.Contains(movie.tmdb_id))
                        .Select(movie => movie.tmdb_id!)
                        .ToHashSetAsync();

                    foreach (var item in response.Results)
                    {
                        if (!IsValidMovieItem(item))
                        {
                            continue;
                        }

                        var tmdbId = item.Id.ToString();
                        if (!existingTmdbIds.Contains(tmdbId))
                        {
                            await ProcessNewMovie(item);
                            existingTmdbIds.Add(tmdbId);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing page {page}: {ex.Message}");
                    _logger.LogError(ex, "Error syncing movies");
                }
            }
        }
    }

    private async Task ProcessNewMovie(MovieItem item)
    {
        var endDate = item.release_date.HasValue ? item.release_date.Value.AddMonths(1).AddDays(15) : DateTime.MinValue;
        var now = DateTime.UtcNow;

        var api_key = _config.ApiKey;
        // Fetch trailer
        var trailer = _config.ConfigEndpoints.Videos.Replace("{movie_id}", item.Id.ToString());
        var url = $"{trailer}?api_key={api_key}&language=vi-VN&include_video_language=vi,en";
        var trailerTask = _httpClient.GetFromJsonAsync<MovieDetailResponse>(url);

        // Fetch runtime
        var runtime = _config.ConfigEndpoints.MovieDetails.Replace("{movie_id}", item.Id.ToString());
        var runtimeUrl = $"{runtime}?api_key={api_key}";
        var runtimeTask = _httpClient.GetFromJsonAsync<MovieDetailResponse>(runtimeUrl);

        await Task.WhenAll(trailerTask, runtimeTask);
        var trailerResponse = trailerTask.Result;
        var runtimeResponse = runtimeTask.Result;


        var newMovie = new Movie
        {
            tmdb_id = item.Id.ToString(),
            adult = item.adult,
            backdrop_path = item.backdrop_path,
            poster_path = item.poster_path,
            title = item.title,
            overview = item.overview,
            release_date = item.release_date.HasValue ? item.release_date.Value.AddHours(7) : DateTime.MinValue, // Convert to UTC+7
            end_date = endDate.AddHours(7), // Convert to UTC+7
            vote_average = item.vote_average,
            vote_count = item.vote_count,
            runtime = runtimeResponse?.runtime ?? 0,
            trailer_url = trailerResponse?.results.FirstOrDefault(v => v.type == "Trailer" && v.site == "YouTube")?.key,
            status = !item.release_date.HasValue ? MovieStatus.Upcoming :
                now < item.release_date.Value ? MovieStatus.Upcoming :
                now > endDate ? MovieStatus.Ended : MovieStatus.Released,
        };

        _dbContext.Movies.Add(newMovie);
        // Save to get the movie_id
        await _dbContext.SaveChangesAsync();

        // Sync actors and genres
        await SyncActorsAsync(newMovie.movie_id, item.Id.ToString());
        await SyncGenresAsync(newMovie.movie_id, item.genre_ids);
    }

    public async Task SyncReviewsAsync()
    {
        if (_config == null || _config.ConfigEndpoints == null)
            throw new Exception("TmdbConfig is missing in appsettings.json");

        var api_key = _config.ApiKey;
        var movies = await _dbContext.Movies.AsNoTracking().ToListAsync();

        string endpoint = _config.ConfigEndpoints.MovieReviews;
        var insertedCount = 0;

        foreach (var movie in movies)
        {
            var movieReviewsEndpoint = endpoint.Replace("{movie_id}", movie.tmdb_id ?? string.Empty);
            var url = $"{movieReviewsEndpoint}?api_key={api_key}&language=vi-VN&page=1";
            var response = await _httpClient.GetFromJsonAsync<ReviewResponse>(url);

            // TMDB may not have localized reviews for vi-VN. Fallback to en-US.
            if (response?.Results == null || response.Results.Count == 0)
            {
                var fallbackUrl = $"{movieReviewsEndpoint}?api_key={api_key}&language=en-US&page=1";
                response = await _httpClient.GetFromJsonAsync<ReviewResponse>(fallbackUrl);
            }

            if (response?.Results != null)
            {
                foreach (var review in response.Results)
                {
                    var normalizedUsername = review.author_details?.username ?? review.author;

                    var existingReview = await _mongoDbContext.Reviews
                        .Find(r => r.movie_id == movie.movie_id
                                   && r.username == normalizedUsername
                                   && r.comment == review.content)
                        .AnyAsync();

                    if (!existingReview)
                    {
                        await _mongoDbContext.Reviews.InsertOneAsync(new Review
                        {
                            movie_id = movie.movie_id,
                            user_id = null,
                            username = normalizedUsername,
                            profile_slug = "tmdb-user",
                            avatar_provider = "tmdb",
                            avatar_path = review.author_details?.avatar_path,
                            comment = review.content,
                            rating = review.author_details?.rating ?? 0,
                            isApproved = true,
                            spoilerFlag = false,
                            createAt = review.created_at,
                            updatedAt = review.updated_at
                        });

                        insertedCount++;
                    }
                }
            }
        }

        _logger.LogInformation("TMDB reviews sync completed. Inserted {InsertedCount} reviews.", insertedCount);
    }

    public async Task ISyncGenresAsync()
    {
        if (_config == null || _config.ConfigEndpoints == null)
            throw new Exception("TmdbConfig is missing in appsettings.json");

        var api_key = _config.ApiKey;
        var endpoint = _config.ConfigEndpoints.Genres;
        var url = $"{endpoint}?api_key={api_key}&language=vi-VN";
        var response = await _httpClient.GetFromJsonAsync<GenreResponse>(url);

        if (response?.Genres != null)
        {
            foreach (var genre in response.Genres)
            {
                var existingGenre = await _dbContext.Genres.AnyAsync(g => g.genre_id == genre.Id);

                if (!existingGenre)
                {
                    _dbContext.Genres.Add(new Genre
                    {
                        genre_id = genre.Id,
                        name = genre.name
                    });
                }
            }

            await _dbContext.SaveChangesAsync();
            RagCacheKeys.Invalidate("genres");
        }
    }

    public async Task SyncGenresAsync(int movie_id, List<int> genreIds)
    {
        if (genreIds.Count == 0)
        {
            return;
        }

        var existingGenreIds = await _dbContext.Genres
            .AsNoTracking()
            .Where(genre => genreIds.Contains(genre.genre_id))
            .Select(genre => genre.genre_id)
            .ToHashSetAsync();

        var existingMovieGenreIds = await _dbContext.MovieGenres
            .AsNoTracking()
            .Where(movieGenre => movieGenre.movie_id == movie_id)
            .Select(movieGenre => movieGenre.genre_id)
            .ToHashSetAsync();

        var newLinks = genreIds
            .Where(genreId => existingGenreIds.Contains(genreId) && !existingMovieGenreIds.Contains(genreId))
            .Select(genreId => new MovieGenre
            {
                movie_id = movie_id,
                genre_id = genreId
            })
            .ToList();

        if (newLinks.Count > 0)
        {
            _dbContext.MovieGenres.AddRange(newLinks);
            await _dbContext.SaveChangesAsync();
            RagCacheKeys.Invalidate("movies");
        }
    }

    public async Task SyncActorsAsync(int movieId, string tmdbMovieId)
    {
        if (_config == null || _config.ConfigEndpoints == null)
            throw new Exception("TmdbConfig is missing in appsettings.json");

        var api_key = _config.ApiKey;
        var endpoint = _config.ConfigEndpoints.Credits.Replace("{movie_id}", tmdbMovieId);
        var url = $"{endpoint}?api_key={api_key}&language=vi-VN";
        var response = await _httpClient.GetFromJsonAsync<ActorResponse>(url);

        if (response?.Cast != null)
        {
            var topCast = response.Cast
                .Where(c => c != null)
                .Select(c => c!)
                .OrderBy(c => c.order)
                .Take(15)
                .Where(c => !string.IsNullOrWhiteSpace(c.name))
                .ToList();
            if (topCast.Count == 0)
            {
                return;
            }

            var actorIds = topCast.Select(cast => cast.Id).ToHashSet();
            var existingActorIds = await _dbContext.Actors
                .AsNoTracking()
                .Where(actor => actorIds.Contains(actor.actor_id))
                .Select(actor => actor.actor_id)
                .ToHashSetAsync();

            var existingMovieActorIds = await _dbContext.MovieActors
                .AsNoTracking()
                .Where(movieActor => movieActor.movie_id == movieId)
                .Select(movieActor => movieActor.actor_id)
                .ToHashSetAsync();

            var hasChanges = false;

            foreach (var cast in topCast)
            {
                if (!existingActorIds.Contains(cast.Id))
                {
                    var personUrl = $"person/{cast.Id}?api_key={api_key}&language=vi-VN";
                    var detail = await _httpClient.GetFromJsonAsync<ActorDetailResponse>(personUrl);

                    var actor = new Actor
                    {
                        actor_id = cast.Id,
                        name = cast.name,
                        profile_path = cast?.profile_path,
                        gender = (ActorGender)cast.gender,
                        biography = detail?.biography,
                        place_of_birth = detail?.place_of_birth,
                        birthday = detail?.birthday ?? null
                    };

                    _dbContext.Actors.Add(actor);
                    existingActorIds.Add(cast.Id);
                    hasChanges = true;
                }

                // Save to MovieActor junction table
                if (!existingMovieActorIds.Contains(cast.Id))
                {
                    _dbContext.MovieActors.Add(new MovieActor
                    {
                        movie_id = movieId,
                        actor_id = cast.Id,
                        char_name = cast.character,
                        order = cast.order
                    });

                    existingMovieActorIds.Add(cast.Id);
                    hasChanges = true;
                }
            }

            if (hasChanges)
            {
                await _dbContext.SaveChangesAsync();
                RagCacheKeys.Invalidate("actors", "movies");
            }
        }
    }

    private static bool IsValidMovieItem(MovieItem item)
    {
        return !string.IsNullOrWhiteSpace(item.title)
               && !string.IsNullOrWhiteSpace(item.overview)
               && !string.IsNullOrWhiteSpace(item.backdrop_path)
               && !string.IsNullOrWhiteSpace(item.poster_path)
               && item.title.Length >= 2
               && item.overview.Length >= 10
               && item.release_date.HasValue
               && item.release_date.Value.Year >= 2025;
    }

    public async Task UpdateMovieStatusesAsync()
    {
        var now = DateTime.UtcNow;

        var moviesToUpdate = await _dbContext.Movies
            .Where(m => m.status != MovieStatus.Ended && m.release_date.HasValue)
            .ToListAsync();

        foreach (var movie in moviesToUpdate)
        {
            if (!movie.release_date.HasValue)
            {
                continue;
            }

            var releaseDate = movie.release_date.Value;
            var endDate = releaseDate.AddMonths(1).AddDays(15);

            if (now < releaseDate)
            {
                movie.status = MovieStatus.Upcoming;
            }
            else if (now <= endDate)
            {
                movie.status = MovieStatus.Released;
            }
            else if (now > endDate)
            {
                movie.status = MovieStatus.Ended;
            }
        }

        await _dbContext.SaveChangesAsync();
        RagCacheKeys.Invalidate("movies");
    }
}
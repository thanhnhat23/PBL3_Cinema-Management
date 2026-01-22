using CinemaAPI.data;
using CinemaAPI.Services.Interfaces;
using CinemaAPI.Models.DTOs;
using Microsoft.Extensions.Options;
using CinemaAPI.Models;
using Microsoft.EntityFrameworkCore;

public class TmdbService : ITmdbService
{
    private readonly HttpClient _httpClient;
    // SQL
    private readonly AppDbContext _dbContext;
    // NoSQL
    private readonly MongoDbContext _mongoDbContext;
    private readonly TmdbConfig _config;

    public TmdbService(
        HttpClient httpClient,
        AppDbContext sqlContext,
        MongoDbContext mongoContext,
        IOptions<TmdbConfig> config)
    {
        _httpClient = httpClient;
        _dbContext = sqlContext;
        _mongoDbContext = mongoContext;
        _config = config.Value;
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

        for (int page = 1; page <= 5; page++)
        {
            var url = $"{endpoint}?api_key={api_key}&language=vi-VN&page={page}&region=VN";
            var response = await _httpClient.GetFromJsonAsync<MovieResponse>(url);

            if (response?.Results != null)
            {
                try
                {
                    foreach (var item in response.Results)
                    {
                        if (string.IsNullOrWhiteSpace(item.title)
                            || string.IsNullOrWhiteSpace(item.overview)
                            || string.IsNullOrWhiteSpace(item.backdrop_path)
                            || string.IsNullOrWhiteSpace(item.poster_path)
                            || item.title.Length < 2
                            || item.overview.Length < 10
                            || item.release_date.Year < 2025
                        ) continue;

                        // Check if movie already exists
                        var existingMovie = await _dbContext.Movies.FirstOrDefaultAsync(m => m.tmdb_id == item.Id.ToString());

                        if (existingMovie == null)
                        {
                            await ProcessNewMovie(item);
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing page {page}: {ex.Message}");
                }
            }
        }
    }

    private async Task ProcessNewMovie(MovieItem item)
    {
        var endDate = item.release_date.AddMonths(1);
        var now = DateTime.UtcNow;

        var newMovie = new Movie
        {
            tmdb_id = item.Id.ToString(),
            adult = item.adult,
            backdrop_path = _config.ImageBaseUrl + item.backdrop_path,
            poster_path = _config.ImageBaseUrl + item.poster_path,
            title = item.title,
            overview = item.overview,
            release_date = item.release_date.AddHours(7), // Convert to UTC+7
            end_date = endDate.AddHours(7), // Convert to UTC+7
            vote_average = item.vote_average,
            vote_count = item.vote_count,
            status = now < item.release_date ? MovieStatus.Upcoming :
                     now > endDate ? MovieStatus.Ended : MovieStatus.Released
        };

        _dbContext.Movies.Add(newMovie);
        // Save to get the movie_id
        await _dbContext.SaveChangesAsync();

        // Sync actors and genres
        await SyncActorsAsync(newMovie.movie_id, item.Id.ToString());
        await SyncGenresAsync(newMovie.movie_id, item.genre_ids);
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
        }
    }

    public async Task SyncGenresAsync(int movie_id, List<int> genreIds)
    {

        foreach (var genre in genreIds)
        {
            var existingGenre = await _dbContext.Genres.AnyAsync(g => g.genre_id == genre);

            if (existingGenre)
            {
                _dbContext.MovieGenres.Add(new MovieGenre
                {
                    movie_id = movie_id,
                    genre_id = genre
                });
            }
        }
        await _dbContext.SaveChangesAsync();
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
            foreach (var cast in response.Cast.OrderBy(c => c.order).Take(15))
            {
                var actor = await _dbContext.Actors.FirstOrDefaultAsync(a => a.actor_id == cast.Id);
                var existingMovieActor = await _dbContext.MovieActors.AnyAsync(ma => ma.movie_id == movieId && ma.actor_id == cast.Id);

                if (string.IsNullOrWhiteSpace(cast.name)) continue;

                if (actor == null)
                {
                    var personUrl = $"person/{cast.Id}?api_key={api_key}&language=vi-VN";
                    var detail = await _httpClient.GetFromJsonAsync<ActorDetailResponse>(personUrl);

                    actor = new Actor
                    {
                        actor_id = cast.Id,
                        name = cast.name,
                        profile_path = _config.ImageBaseUrl + cast.profile_path,
                        gender = (ActorGender)cast.gender,
                        biography = !string.IsNullOrWhiteSpace(detail?.biography)
                                        ? detail.biography
                                        : "Updating...",
                        place_of_birth = !string.IsNullOrWhiteSpace(detail?.place_of_birth)
                                        ? detail.place_of_birth
                                        : "Updating...",
                        birthday = detail?.birthday ?? null
                    };

                    _dbContext.Actors.Add(actor);
                    await _dbContext.SaveChangesAsync();
                }

                // Save to MovieActor junction table
                if (!existingMovieActor)
                {
                    _dbContext.MovieActors.Add(new MovieActor
                    {
                        movie_id = movieId,
                        actor_id = cast.Id,
                        char_name = cast.character,
                        order = cast.order
                    });

                    await _dbContext.SaveChangesAsync();
                }
            }
        }
    }
}
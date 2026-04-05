using CinemaAPI.Services.Interfaces;
using CinemaAPI.data;
using Microsoft.EntityFrameworkCore;

public class TmdbSyncWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TmdbSyncWorker> _logger;

    public TmdbSyncWorker(IServiceProvider serviceProvider, ILogger<TmdbSyncWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Wait 10 seconds for app to fully initialize before starting sync
        _logger.LogInformation("TmdbSyncWorker starting in 10 seconds...");
        await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Starting automatic TMDB data synchronization at: {time}", DateTimeOffset.UtcNow);

            using (var scope = _serviceProvider.CreateScope())
            {
                var tmdbService = scope.ServiceProvider.GetRequiredService<ITmdbService>();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                try
                {
                    // Check if Genres table has data, if not, sync genres first
                    var genresCount = await dbContext.Genres.CountAsync(stoppingToken);

                    if (genresCount == 0)
                    {
                        _logger.LogInformation("Genres table is empty. Syncing genres first...");
                        await tmdbService.ISyncGenresAsync();
                        _logger.LogInformation("Genres synced successfully.");
                    }
                    else
                    {
                        _logger.LogInformation("Found {count} genres in database.", genresCount);
                    }

                    // Now sync movies
                    await tmdbService.SyncMovieAsync("nowplaying");
                    await tmdbService.SyncMovieAsync("upcoming");
                    await tmdbService.SyncMovieAsync("popular");

                    // Check release dates and update movie status if needed
                    await tmdbService.UpdateMovieStatusesAsync();

                    // Sync reviews
                    await tmdbService.SyncReviewsAsync();

                    _logger.LogInformation("Synchronization completed successfully.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during automatic movie synchronization. Will retry in 24 hours.");
                }
            }

            // Wait for 24 hours before the next sync
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
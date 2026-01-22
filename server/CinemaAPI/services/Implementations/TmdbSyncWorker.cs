using CinemaAPI.Services.Interfaces;

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
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Starting automatic TMDB data synchronization at: {time}", DateTimeOffset.UtcNow);

            using (var scope = _serviceProvider.CreateScope())
            {
                var tmdbService = scope.ServiceProvider.GetRequiredService<ITmdbService>();
                try 
                {
                    await tmdbService.SyncMovieAsync("nowplaying");
                    await tmdbService.SyncMovieAsync("upcoming");
                    await tmdbService.SyncMovieAsync("popular");
                    
                    _logger.LogInformation("Synchronization completed successfully.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during automatic movie synchronization.");
                }
            }

            // Wait for 24 hours before the next sync
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
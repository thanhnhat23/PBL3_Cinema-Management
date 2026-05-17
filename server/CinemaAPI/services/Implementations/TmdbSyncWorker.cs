using CinemaAPI.Services.Interfaces;
using CinemaAPI.data;
using CinemaAPI.Models;
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
        _logger.LogInformation("TmdbSyncWorker starting...");
        
        // Track the last time TMDB sync was performed
        DateTime lastTmdbSync = DateTime.MinValue;

        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                
                // 1. Dọn dẹp Booking Pending quá hạn (mỗi 5 phút)
                await CleanupPendingBookings(dbContext);

                // 2. Đồng bộ TMDB (mỗi 24 giờ)
                if (DateTime.UtcNow - lastTmdbSync >= TimeSpan.FromHours(24))
                {
                    var tmdbService = scope.ServiceProvider.GetRequiredService<ITmdbService>();
                    await SyncTmdbData(tmdbService, dbContext);
                    lastTmdbSync = DateTime.UtcNow;
                }
            }

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }

    private async Task CleanupPendingBookings(AppDbContext dbContext)
    {
        try
        {
            _logger.LogInformation("Checking for stale pending bookings at: {time}", DateTimeOffset.UtcNow);
            
            // Một booking được coi là quá hạn nếu ở trạng thái Pending quá 10 phút
            var threshold = DateTime.UtcNow.AddMinutes(-10);
            
            var staleBookings = await dbContext.Bookings
                .Include(b => b.ShowTimeSeats)
                .Where(b => b.status == BookingStatus.Pending && b.createAt < threshold)
                .ToListAsync();

            if (staleBookings.Any())
            {
                _logger.LogInformation("Found {count} stale pending bookings to clean up.", staleBookings.Count);
                
                foreach (var booking in staleBookings)
                {
                    booking.status = BookingStatus.Cancelled;
                    
                    // Giải phóng ghế
                    foreach (var seat in booking.ShowTimeSeats)
                    {
                        seat.status = ShowTimeSeatStatus.Available;
                        seat.booking_id = null;
                    }
                }

                await dbContext.SaveChangesAsync();
                _logger.LogInformation("Stale bookings cleaned up and seats released successfully.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while cleaning up stale bookings.");
        }
    }

    private async Task SyncTmdbData(ITmdbService tmdbService, AppDbContext dbContext)
    {
        try
        {
            _logger.LogInformation("Starting automatic TMDB data synchronization at: {time}", DateTimeOffset.UtcNow);
            await tmdbService.UpdateMovieStatusesAsync();
            _logger.LogInformation("TMDB Synchronization completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during automatic TMDB synchronization.");
        }
    }
}

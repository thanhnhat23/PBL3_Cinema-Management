using CinemaAPI.Services.Interfaces;
using CinemaAPI.data;
using CinemaAPI.Models;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Microsoft.AspNetCore.SignalR;
using CinemaAPI.Hubs;

public class TmdbSyncWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TmdbSyncWorker> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IHubContext<SeatLockHub> _hubContext;

    public TmdbSyncWorker(
        IServiceProvider serviceProvider, 
        ILogger<TmdbSyncWorker> logger,
        IConnectionMultiplexer redis,
        IHubContext<SeatLockHub> hubContext)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _redis = redis;
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("TmdbSyncWorker starting...");
        
        // Start TMDB sync loop in a separate background task so it doesn't block or delay the booking cleanup loop
        _ = Task.Run(async () =>
        {
            // Initial delay to let the app start up fully before running a heavy TMDB sync
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Running background TMDB data sync...");
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        var tmdbService = scope.ServiceProvider.GetRequiredService<ITmdbService>();
                        await SyncTmdbData(tmdbService, dbContext);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in TMDB sync task.");
                }

                // Repeat every 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }, stoppingToken);

        // Booking cleanup loop - runs every 10 seconds for real-time responsiveness
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    await CleanupPendingBookings(dbContext);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Booking Cleanup loop.");
            }

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }

    private async Task CleanupPendingBookings(AppDbContext dbContext)
    {
        try
        {
            _logger.LogInformation("Checking for stale pending bookings at: {time}", DateTimeOffset.UtcNow);
            
            var thresholdUtc = DateTime.UtcNow.AddMinutes(-5);
            var thresholdLocal = DateTime.Now.AddMinutes(-5);
            
            var staleBookings = await dbContext.Bookings
                .Include(b => b.ShowTimeSeats)
                .Where(b => b.status == BookingStatus.Pending && (b.createAt < thresholdUtc || b.createAt < thresholdLocal))
                .ToListAsync();

            if (staleBookings.Any())
            {
                _logger.LogInformation("Found {count} stale pending bookings to clean up.", staleBookings.Count);
                
                var redisDb = _redis.GetDatabase();

                foreach (var booking in staleBookings)
                {
                    booking.status = BookingStatus.Cancelled;
                    
                    foreach (var seat in booking.ShowTimeSeats)
                    {
                        seat.status = ShowTimeSeatStatus.Available;
                        seat.booking_id = null;

                        // Delete Redis lock key so other active clients see it as free
                        var lockKey = $"seat_lock:{booking.showtime_id}:{seat.seat_id}";
                        await redisDb.KeyDeleteAsync(lockKey);

                        // Broadcast to other users in real time that this seat is now available
                        await _hubContext.Clients.Group(booking.showtime_id.ToString()).SendAsync("SeatUnlocked", new
                        {
                            showtimeId = booking.showtime_id,
                            seatId = seat.seat_id
                        });
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

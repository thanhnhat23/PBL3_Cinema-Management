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
        
        // Track the last time TMDB sync was performed
        DateTime lastTmdbSync = DateTime.MinValue;

        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                await CleanupPendingBookings(dbContext);
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
            
            // Một booking được coi là quá hạn nếu ở trạng thái Pending quá 5 phút
            var threshold = DateTime.UtcNow.AddMinutes(-5);
            
            var staleBookings = await dbContext.Bookings
                .Include(b => b.ShowTimeSeats)
                .Where(b => b.status == BookingStatus.Pending && b.createAt < threshold)
                .ToListAsync();

            if (staleBookings.Any())
            {
                _logger.LogInformation("Found {count} stale pending bookings to clean up.", staleBookings.Count);
                
                var redisDb = _redis.GetDatabase();

                foreach (var booking in staleBookings)
                {
                    booking.status = BookingStatus.Cancelled;
                    
                    // Giải phóng ghế
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

using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaAPI.data;
using Microsoft.EntityFrameworkCore;
using CinemaAPI.Models;

namespace CinemaAPI.Hubs
{
    public class SeatLockHub : Hub
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly AppDbContext _dbContext;
        private static readonly string LuaUnlockScript = @"
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end";

        public SeatLockHub(IConnectionMultiplexer redis, AppDbContext dbContext)
        {
            _redis = redis;
            _dbContext = dbContext;
        }

        public async Task JoinShowtimeGroup(int showtimeId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, showtimeId.ToString());

            // Retrieve all currently locked seats for this showtime from Redis
            var db = _redis.GetDatabase();
            var lockedSeats = new List<object>();

            // Find an active/connected Redis server from the endpoints list
            IServer server = null;
            foreach (var ep in _redis.GetEndPoints())
            {
                try
                {
                    var s = _redis.GetServer(ep);
                    if (s.IsConnected)
                    {
                        server = s;
                        break;
                    }
                }
                catch
                {
                    // Ignore connection errors on offline endpoints and try the next one
                }
            }

            if (server == null)
            {
                server = _redis.GetServer(_redis.GetEndPoints().First());
            }

            var pattern = $"seat_lock:{showtimeId}:*";
            var keys = server.Keys(pattern: pattern).ToList();

            foreach (var key in keys)
            {
                var seatIdStr = key.ToString().Split(':').Last();
                var holder = await db.StringGetAsync(key);
                if (holder.HasValue)
                {
                    // Retrieve remaining TTL
                    var expiry = await db.KeyTimeToLiveAsync(key);
                    var expiresAt = DateTime.UtcNow.Add(expiry ?? TimeSpan.FromMinutes(5));

                    lockedSeats.Add(new
                    {
                        showtimeId,
                        seatId = int.Parse(seatIdStr),
                        userId = holder.ToString(),
                        expiresAt
                    });
                }
            }

            await Clients.Caller.SendAsync("CurrentLockedSeats", lockedSeats);
        }

        public async Task LeaveShowtimeGroup(int showtimeId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, showtimeId.ToString());
        }

        public async Task LockSeat(int showtimeId, int seatId, string userId)
        {
            var db = _redis.GetDatabase();
            var lockKey = $"seat_lock:{showtimeId}:{seatId}";
            var connKey = $"conn_locks:{Context.ConnectionId}";

            // Acquire lock atomically if key does not exist. TTL: 5 minutes.
            var acquired = await db.StringSetAsync(lockKey, userId, TimeSpan.FromMinutes(5), When.NotExists);

            if (acquired)
            {
                // Map connection to the locked seat for auto-release on disconnect
                await db.SetAddAsync(connKey, $"{showtimeId}:{seatId}:{userId}");
                await db.KeyExpireAsync(connKey, TimeSpan.FromMinutes(5));

                var expiresAt = DateTime.UtcNow.AddMinutes(5);

                // Notify all group members (except sender)
                await Clients.Group(showtimeId.ToString()).SendAsync("SeatLocked", new
                {
                    showtimeId,
                    seatId,
                    userId,
                    expiresAt
                });

                // Confirm success to the caller
                await Clients.Caller.SendAsync("LockResult", new
                {
                    success = true,
                    showtimeId,
                    seatId,
                    message = "Seat successfully locked"
                });
            }
            else
            {
                // Lock failed - seat is already held by someone else
                var currentHolder = await db.StringGetAsync(lockKey);
                await Clients.Caller.SendAsync("LockResult", new
                {
                    success = false,
                    showtimeId,
                    seatId,
                    message = "Seat is already locked by another user",
                    currentHolder = currentHolder.ToString()
                });
            }
        }

        public async Task UnlockSeat(int showtimeId, int seatId, string userId)
        {
            var db = _redis.GetDatabase();
            var lockKey = $"seat_lock:{showtimeId}:{seatId}";
            var connKey = $"conn_locks:{Context.ConnectionId}";

            // Execute atomic release Lua script
            var result = await db.ScriptEvaluateAsync(LuaUnlockScript, new RedisKey[] { lockKey }, new RedisValue[] { userId });
            var released = (int)result == 1;

            if (released)
            {
                // Remove from connection mapping
                await db.SetRemoveAsync(connKey, $"{showtimeId}:{seatId}:{userId}");

                // Notify all group members (including sender or group-wide)
                await Clients.Group(showtimeId.ToString()).SendAsync("SeatUnlocked", new
                {
                    showtimeId,
                    seatId
                });

                // Confirm success to caller
                await Clients.Caller.SendAsync("UnlockResult", new
                {
                    success = true,
                    showtimeId,
                    seatId,
                    message = "Seat unlocked successfully"
                });
            }
            else
            {
                await Clients.Caller.SendAsync("UnlockResult", new
                {
                    success = false,
                    showtimeId,
                    seatId,
                    message = "Failed to unlock seat (lock may have expired or is held by someone else)"
                });
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var db = _redis.GetDatabase();
            var connKey = $"conn_locks:{Context.ConnectionId}";
            var lockedSeats = await db.SetMembersAsync(connKey);

            if (lockedSeats.Length > 0)
            {
                foreach (var seatStr in lockedSeats)
                {
                    var parts = seatStr.ToString().Split(':');
                    if (parts.Length == 3)
                    {
                         var showtimeIdStr = parts[0];
                        var seatIdStr = parts[1];
                        var userId = parts[2];

                        var showtimeId = int.Parse(showtimeIdStr);
                        var seatId = int.Parse(seatIdStr);
                        var userGuid = Guid.Parse(userId);

                        // If this seat has been converted into a pending booking in SQL, DO NOT unlock it on Redis!
                        // The background cleanup worker will clean it up if payment fails or expires.
                        var isPendingInDb = await _dbContext.ShowTimeSeats
                            .AnyAsync(sts => sts.showtime_id == showtimeId 
                                             && sts.seat_id == seatId 
                                             && sts.Booking != null 
                                             && sts.Booking.user_id == userGuid 
                                             && sts.Booking.status == BookingStatus.Pending);

                        if (isPendingInDb)
                        {
                            continue;
                        }

                        var lockKey = $"seat_lock:{showtimeIdStr}:{seatIdStr}";

                        // Release lock atomically
                        var result = await db.ScriptEvaluateAsync(LuaUnlockScript, new RedisKey[] { lockKey }, new RedisValue[] { userId });
                        if ((int)result == 1)
                        {
                            await Clients.Group(showtimeIdStr).SendAsync("SeatUnlocked", new
                            {
                                showtimeId = int.Parse(showtimeIdStr),
                                seatId = int.Parse(seatIdStr)
                            });
                        }
                    }
                }

                await db.KeyDeleteAsync(connKey);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}

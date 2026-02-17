using CinemaAPI.data;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ExpiredResetTokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(5); // Check every 5 minute

        public ExpiredResetTokenCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    var now = DateTime.UtcNow;

                    // Delete unverified users with expired verification tokens
                    var unverifiedExpiredUsers = await dbContext.Users
                        .Where(u => !u.isEmailVerified 
                              && u.verificationToken != null 
                              && u.verificationTokenExpires != null 
                              && u.verificationTokenExpires < now)
                        .ToListAsync(stoppingToken);

                    if (unverifiedExpiredUsers.Count > 0)
                    {
                        Console.WriteLine($"[Cleanup] Found {unverifiedExpiredUsers.Count} unverified user(s) with expired tokens. Deleting...");
                        
                        foreach (var user in unverifiedExpiredUsers)
                        {
                            Console.WriteLine($"[Cleanup] Deleting user: {user.userName} ({user.email}) - Token expired at {user.verificationTokenExpires}");
                            dbContext.Users.Remove(user);
                        }

                        await dbContext.SaveChangesAsync(stoppingToken);
                        Console.WriteLine($"[Cleanup] Successfully deleted {unverifiedExpiredUsers.Count} unverified user(s).");
                    }

                    // Clear expired reset tokens (don't delete user, just clear the token)
                    var expiredResetTokenUsers = await dbContext.Users
                        .Where(u => u.passwordResetToken != null 
                              && u.resetTokenExpires != null 
                              && u.resetTokenExpires < now)
                        .ToListAsync(stoppingToken);

                    if (expiredResetTokenUsers.Count > 0)
                    {
                        Console.WriteLine($"[Cleanup] Clearing {expiredResetTokenUsers.Count} expired reset token(s).");
                        
                        foreach (var user in expiredResetTokenUsers)
                        {
                            user.passwordResetToken = null;
                            user.resetTokenExpires = null;
                        }

                        await dbContext.SaveChangesAsync(stoppingToken);
                        Console.WriteLine($"[Cleanup] Successfully cleared {expiredResetTokenUsers.Count} reset token(s).");
                    }
                } 
                catch (Exception ex)
                {
                    Console.WriteLine($"[Cleanup Error] Error in ExpiredResetTokenCleanupService: {ex.Message}");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}
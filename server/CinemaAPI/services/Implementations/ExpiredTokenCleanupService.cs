using CinemaAPI.data;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ExpiredResetTokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(5);

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

                    var expiredUsers = await dbContext.Users
                        .Where(u => u.passwordResetToken != null && u.resetTokenExpires != null && u.resetTokenExpires < now
                              || u.verificationToken != null && u.verificationTokenExpires != null && u.verificationTokenExpires < now)
                        .ToListAsync(stoppingToken);

                    if (expiredUsers.Count > 0)
                    {
                        foreach (var user in expiredUsers)
                        {
                            user.passwordResetToken = null;
                            user.resetTokenExpires = null;
                            user.verificationToken = null;
                            user.verificationTokenExpires = null;
                        }

                        await dbContext.SaveChangesAsync(stoppingToken);
                    }
                } catch (Exception ex)
                {
                    Console.WriteLine($"Error in ExpiredResetTokenCleanupService: {ex.Message}");
                    throw new Exception("An error occurred during expired token cleanup.", ex);
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}

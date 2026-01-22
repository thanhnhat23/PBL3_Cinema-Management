using Microsoft.EntityFrameworkCore;
using CinemaAPI.Models;

namespace CinemaAPI.data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        // DbSets for each model
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<UserVoucher> UserVouchers { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Cinema> Cinemas { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<MovieActor> MovieActors { get; set; }
        public DbSet<Actor> Actors { get; set; }
        public DbSet<MovieGenre> MovieGenres { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingSnacks> BookingSnacks { get; set; }
        public DbSet<Snack> Snacks { get; set; }
        public DbSet<ShowTime> ShowTimes { get; set; }
        public DbSet<ShowTimeSeat> ShowTimeSeats { get; set; }

        // Model configurations
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-Many Relationships
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.user_id, ur.role_id });
            modelBuilder.Entity<MovieActor>()
                .HasKey(ma => new { ma.movie_id, ma.actor_id });
            modelBuilder.Entity<MovieGenre>()
                .HasKey(mg => new { mg.movie_id, mg.genre_id });
            modelBuilder.Entity<BookingSnacks>()
                .HasKey(bs => new { bs.booking_id, bs.snack_id });
            modelBuilder.Entity<ShowTimeSeat>()
                .HasKey(sts => new { sts.showtime_id, sts.seat_id });
            modelBuilder.Entity<UserVoucher>()
                .HasKey(uv => new { uv.user_id, uv.coupon_id });
            
            // Configure enum
            modelBuilder.Entity<Role>()
                .Property(s => s.type)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
            modelBuilder.Entity<Booking>()
                .Property(s => s.status)
                .HasConversion<string>()
                .HasMaxLength(20);
            modelBuilder.Entity<Booking>()
                .Property(s => s.paymentMethod)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
            modelBuilder.Entity<Seat>()
                .Property(s => s.type)
                .HasConversion<string>()
                .HasMaxLength(20);
            modelBuilder.Entity<Snack>()
                .Property(s => s.type)
                .HasConversion<string>()
                .HasMaxLength(20);
            modelBuilder.Entity<Room>()
                .Property(r => r.roomLayoutType)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
            modelBuilder.Entity<Movie>()
                .Property(m => m.status)
                .HasConversion<string>()
                .HasMaxLength(20);
            modelBuilder.Entity<Actor>()
                .Property(a => a.gender)
                .HasConversion<string>()
                .HasMaxLength(20);
            
            // Configure decimal precision
            modelBuilder.Entity<Coupon>()
                .Property(c => c.discountValue)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Coupon>()
                .Property(c => c.minOrderValue)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Coupon>()
                .Property(c => c.maxDiscountAmount)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Room>()
                .Property(r => r.price)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Snack>()
                .Property(s => s.price)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<BookingSnacks>()
                .Property(bs => bs.price)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Booking>()
                .Property(b => b.totalAmount)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Booking>()
                .Property(b => b.discountAmount)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Booking>()
                .Property(b => b.finalAmount)
                .HasColumnType("decimal(18, 2)");
        }
    }
}
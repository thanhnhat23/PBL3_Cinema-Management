using Microsoft.EntityFrameworkCore;
using CinemaAPI.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        // DbSets for each model
        public DbSet<User> Users { get; set; }
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
        public DbSet<ShowTimeSlot> ShowTimeSlots { get; set; }
        public DbSet<ShowTimeSeat> ShowTimeSeats { get; set; }
        public DbSet<ShowTimePrice> ShowTimePrices { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<ComboDetail> ComboDetails { get; set; }
        public DbSet<SeatType> SeatTypes { get; set; }
        public DbSet<PointTransaction> PointTransactions { get; set; }
        public DbSet<BlacklistedToken> BlacklistedTokens { get; set; }

        // Model configurations
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-Many Relationships
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
            modelBuilder.Entity<Inventory>()
                .HasKey(inv => new { inv.snack_id, inv.cinema_id });
            modelBuilder.Entity<ComboDetail>()
                .HasKey(cd => new { cd.combo_id, cd.snack_id });
            modelBuilder.Entity<ComboDetail>()
                .HasOne(cd => cd.ComboSnack)
                .WithMany()
                .HasForeignKey(cd => cd.combo_id)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ComboDetail>()
                .HasOne(cd => cd.Snack)
                .WithMany(s => s.ComboDetails)
                .HasForeignKey(cd => cd.snack_id)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ShowTimePrice>()
                .HasKey(stp => new { stp.type_id, stp.showtime_id });

            // ShowTime -> ShowTimeSlot (optional)
            modelBuilder.Entity<ShowTime>()
                .HasOne(s => s.Slot)
                .WithMany(slot => slot.ShowTimes)
                .HasForeignKey(s => s.slot_id)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure one-to-one
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.PointTransaction)
                .WithOne(pt => pt.Booking)
                .HasForeignKey<PointTransaction>(pt => pt.booking_id);
            
            
            // Configure enum
            modelBuilder.Entity<User>()
                .Property(u => u.role)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
            modelBuilder.Entity<Booking>()
                .Property(s => s.status)
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
            modelBuilder.Entity<Payment>()
                .Property(p => p.method)
                .HasConversion<string>()
                .HasMaxLength(20);
            modelBuilder.Entity<Payment>()
                .Property(p => p.status)
                .HasConversion<string>()
                .HasMaxLength(20);
            modelBuilder.Entity<PointTransaction>()
                .Property(pt => pt.type)
                .HasConversion<string>()
                .HasMaxLength(20);
            modelBuilder.Entity<SeatType>()
                .Property(st => st.type_name)
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
            modelBuilder.Entity<Cinema>()
                .Property(c => c.latitude)
                .HasColumnType("decimal(18, 10)");
            modelBuilder.Entity<Cinema>()
                .Property(c => c.longitude)
                .HasColumnType("decimal(18, 10)");
        }
    }
}
using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class PaymentService : BaseService<Payment>, IPaymentService
    {
        private new readonly AppDbContext _dbContext;

        public PaymentService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Payment>> GetAllPayments() =>
            await _dbContext.Payments
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .ToListAsync();
        public async Task<Payment?> GetPaymentById(int payment_id) =>
            await _dbContext.Payments
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .FirstOrDefaultAsync(p => p.payment_id == payment_id);
        public async Task AddPayment(Payment payment)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var bookingExists = await _dbContext.Bookings.AnyAsync(b => b.booking_id == payment.booking_id);
                if (!bookingExists)
                {
                    throw new ArgumentException($"Booking {payment.booking_id} not found.");
                }

                await _dbContext.Payments.AddAsync(payment);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                if (ex is ArgumentException)
                {
                    throw;
                }
                throw new Exception("Failed to add payment", ex);
            }
        }
        public async Task UpdatePayment(int payment_id, PaymentUpdateRequest request)
        {
            var payment = await _dbContext.Payments.FindAsync(payment_id);
            if (payment == null) throw new Exception("Payment not found");
            try
            {
                payment.booking_id = request.booking_id ?? payment.booking_id;
                payment.amount = request.amount ?? payment.amount;
                payment.method = request.method ?? payment.method;
                payment.status = request.status ?? payment.status;
                payment.provider = request.provider ?? payment.provider;
                payment.transaction_code = request.transaction_code ?? payment.transaction_code;
                payment.paidAt = request.paidAt ?? payment.paidAt;
                payment.refund_code = request.refund_code ?? payment.refund_code;
                payment.refundAt = request.refundAt ?? payment.refundAt;

                _dbContext.Payments.Update(payment);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to update payment", ex);
            }
        }
    }
}

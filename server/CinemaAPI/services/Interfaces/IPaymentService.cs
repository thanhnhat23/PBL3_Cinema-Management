using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<List<Payment>> GetAllPayments();
        Task<Payment?> GetPaymentById(int id);
        Task AddPayment(Payment payment);
        Task UpdatePayment(int id, PaymentUpdateRequest request);
        Task DeletePayment(int id);
    }
}
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<List<Payment>> GetAllPaymentsAsync();
        Task<Payment?> GetPaymentByIdAsync(int paymentId);
        Task<CreatePaymentResult> CreatePaymentUrlAsync(PaymentCreateRequest request, string ipAddress);
        Task<PaymentCallbackResult> HandleVnpayCallbackAsync(IReadOnlyDictionary<string, string> queryParams);
    }
}

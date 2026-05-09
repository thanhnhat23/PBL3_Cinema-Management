using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IVnpayPaymentService
    {
        Task<List<VnpayPayment>> GetAllPaymentsAsync();
        Task<VnpayPayment?> GetPaymentByIdAsync(int paymentId);
        Task<CreateVnpayPaymentResult> CreatePaymentUrlAsync(VnpayPaymentCreateRequest request, string ipAddress);
        Task<VnpayPaymentCallbackResult> HandleVnpayCallbackAsync(IReadOnlyDictionary<string, string> queryParams);
    }
}

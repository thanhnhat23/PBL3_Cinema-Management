using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IMomoPaymentService
    {
        Task<List<MomoPayment>> GetAllPaymentsAsync();
        Task<MomoPayment?> GetPaymentByIdAsync(int paymentId);
        Task<CreateMomoPaymentResult> CreatePaymentUrlAsync(MomoPaymentCreateRequest request);
        Task<MomoPaymentCallbackResult> HandleMomoCallbackAsync(IReadOnlyDictionary<string, string> queryParams);
    }
}

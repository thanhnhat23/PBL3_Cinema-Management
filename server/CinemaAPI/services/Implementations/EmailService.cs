using Resend;
using CinemaAPI.Services.Interfaces;

namespace CinemaAPI.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IResend _resendClient;

        public EmailService(IResend resendClient, IConfiguration configuration)
        {
            _resendClient = resendClient;
        }

        public async Task SendResetPasswordEmailAsync(string email, string resetToken)
        {
            try
            {
                var message = new EmailMessage();
                message.From = "MilkyWayyy Cinema <support@milkywayyy.me>";
                message.To.Add(email);
                message.Subject = "Mã xác nhận đặt lại mật khẩu của bạn";
                message.HtmlBody = $@"
                <div style=""font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;"">
                    <div style=""background-image: url(https://i.pinimg.com/1200x/9a/3d/eb/9a3deb34b6995a52e8635a6f4cbe90c2.jpg);
                                background-size: cover; 
                                background-position: center;
                                padding: 30px; 
                                text-align: center;"">
                        <h1 style=""color: #FFFFFF;
                                margin: 0;
                                font-size: 35px; 
                                letter-spacing: 2px;
                                text-shadow:
                                    0 0 5px #a8a7a7, 
                                    0 0 10px #ffffff;
                                font-weight: bold;""
                        >
                            MILK<span style=""color: #ffd000; text-shadow: 
                                        0 0 5px #ffffff, 
                                        0 0 10px #ffd000, 
                                        0 0 20px #ffe057"">Y</span>WA<span style=""color: #ffd000; text-shadow: 
                                        0 0 5px #ffffff, 
                                        0 0 10px #ffd000, 
                                        0 0 20px #ffe057"">YYY</span> CINEMA
                        </h1>
                    </div>
                    
                    <div style=""padding: 40px 30px; background-color: #ffffff;"">
                        <h2 style=""color: #333333; margin-top: 0; text-align: center;"">Xác nhận đặt lại mật khẩu</h2>
                        <p style=""color: #666666; line-height: 1.6; font-size: 16px;"">
                            Chào bạn, chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này. 
                            Vui lòng sử dụng mã xác nhận bên dưới để hoàn tất quá trình:
                        </p>
                        
                        <div style=""text-align: center; margin: 30px 0;"">
                            <div style=""display: inline-block; padding: 15px 40px; background-color: #f4f9ff; border: 2px dashed #8fc9ff; border-radius: 4px;"">
                                <span style=""font-size: 32px; font-weight: bold; color: #4ca8ff; letter-spacing: 5px;"">{resetToken}</span>
                            </div>
                        </div>
                        
                        <p style=""color: #ff4b4b; font-size: 14px; font-weight: bold; text-align: center;"">
                            * Lưu ý: Mã này chỉ có hiệu lực trong vòng 5 phút.
                        </p>
                        
                        <hr style=""border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;"">
                        
                        <p style=""color: #999999; font-size: 13px; line-height: 1.5;"">
                            Nếu bạn không thực hiện yêu cầu này, bạn có thể an tâm bỏ qua email này.
                            <br/> 
                            Mật khẩu của bạn sẽ không thay đổi trừ khi bạn sử dụng mã trên để xác nhận.
                        </p>
                    </div>
                    
                    <div style=""background-color: #f4f4f4; padding: 20px; text-align: center; color: #888888; font-size: 12px;"">
                        <p style=""margin: 5px 0;"">© 2026 MilkyWayyy Cinema. All rights reserved.</p>
                        <p style=""margin: 5px 0;"">Đại học Bách Khoa - Đại học Đà Nẵng, Đà Nẵng, Việt Nam</p>
                    </div>
                </div>";

                await _resendClient.EmailSendAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SendResetPasswordEmailAsync Error: {ex.Message}");
                throw new Exception("An error occurred while sending reset password email.");
            }
        }
    }
}
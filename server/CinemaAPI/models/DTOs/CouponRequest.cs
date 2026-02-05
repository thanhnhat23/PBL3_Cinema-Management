using System.ComponentModel;
using System.Diagnostics.Contracts;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace CinemaAPI.Models.DTOs
{
    public class CouponUpdateRequest
    {
        public string? description { get; set; } = null;

        public decimal? discountValue { get; set; } = null;

        public decimal? maxDiscountAmount { get; set; } = null;

        public decimal? minDiscountAmount { get; set; } = null;

        public DateTime startDate { get; set; } 

        public DateTime endDate { get; set; } 

        public bool isHoliday { get; set; } 
    }
}
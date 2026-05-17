using System;

namespace CinemaAPI.Models.DTOs
{
    public class DeletedItemResponse
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; }
        public DateTime? DeletedAt { get; set; }
        public Guid? DeletedByUserId { get; set; }
        public string? DeletedByUserName { get; set; }
        public string? DeletedByAvatarPath { get; set; }
    }
}

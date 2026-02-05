// using CinemaAPI.Services.Interfaces;
// using Microsoft.AspNetCore.SignalR;
// using System.Security.Claims;

// namespace CinemaAPI.Hubs
// {
//     public class ChatHub : Hub
//     {
//         private readonly IChatService _chatService;

//         public ChatHub(IChatService chatService)
//         {
//             _chatService = chatService;
//         }

//         public async Task SendMessage(string message)
//         {
//             var user_id = GetUserIdFromContext();

//             await foreach (var response in _chatService.GetChatResponseStreamAsync(user_id, message))
//             {
//                 await Clients.Caller.SendAsync("ReceiveMessage", response);
//             }

//             await Clients.Caller.SendAsync("MessageComplete");
//         }

//         private string GetUserIdFromContext()
//         {
//             var userId = Context.User?.FindFirst("user_id")?.Value;
//             if (!string.IsNullOrWhiteSpace(userId))
//             {
//                 return userId;
//             }

//             var httpContext = Context.GetHttpContext();
//             userId = httpContext?.Request.Query["user_id"].ToString();
//             if (!string.IsNullOrWhiteSpace(userId))
//             {
//                 return userId;
//             }

//             throw new HubException("User not authenticated");
//         }
//     }
// }
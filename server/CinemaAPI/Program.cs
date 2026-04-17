using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Services.Interfaces;
using CinemaAPI.Services.Implementations;
// using CinemaAPI.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using MongoDB.Driver;
using Resend;
using Microsoft.AspNetCore.ResponseCompression;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddMemoryCache();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins(
                        "http://localhost:5173",  // Vite dev server
                        "http://localhost:3000",  // Docker client
                        "http://cinema_client",   // Docker service name
                        "https://cinema-client-vetv.onrender.com", // Deployed client
                        "https://milkywayyy.me"
                    )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
});

// Configure Database Connection
var connectionString = builder.Configuration.GetConnectionString("CinemaDatabase");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, Microsoft.EntityFrameworkCore.ServerVersion.AutoDetect(connectionString))
);

// Configure MongoDB
builder.Services.AddSingleton<MongoDbContext>();

// Configure Gemini
builder.Services.Configure<GeminiConfig>(builder.Configuration.GetSection("Gemini"));

// Configure Cloudinary
builder.Services.Configure<CloudinaryConfig>(builder.Configuration.GetSection("Cloudinary"));

// Configure Services
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IService, Service>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IGeminiService, GeminiService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<CouponService>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<MovieService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IActorService, ActorService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<LocationService>();
builder.Services.AddScoped<ICinemaService, CinemaService>();
builder.Services.AddScoped<CinemaService>();
builder.Services.AddScoped<ISnackService, SnackService>();
builder.Services.AddScoped<SnackService>();
builder.Services.AddScoped<IComboDetail, ComboDetailService>();
builder.Services.AddScoped<ComboDetailService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<PaymentService>();

// Configure SignalR
builder.Services.AddSignalR();

// Configure Tmdb
builder.Services.Configure<TmdbConfig>(builder.Configuration.GetSection("TmdbConfig"));
builder.Services.AddHttpClient<ITmdbService, TmdbService>(client =>
{
    var baseUrl = builder.Configuration["TmdbConfig:BaseUrl"];
    if (string.IsNullOrWhiteSpace(baseUrl))
    {
        throw new InvalidOperationException("TmdbConfig:BaseUrl is not configured.");
    }

    client.BaseAddress = new Uri(baseUrl);
});

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    }
); ;

builder.Services.AddHostedService<TmdbSyncWorker>();
builder.Services.AddHostedService<ExpiredResetTokenCleanupService>();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

// Configure Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});
// (Assuming JWT Bearer Authentication)
builder.Services.AddAuthorization();

// Configure resend email service
builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = builder.Configuration["Resend:ApiKey"]!;
});
builder.Services.AddTransient<IResend, ResendClient>();

// Configure Gzip Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});

var app = builder.Build();

// Use Gzip Compression
app.UseResponseCompression();

// Auto-migrate in Development/Docker by default. Production can opt in via Database:AutoMigrate=true.
var shouldAutoMigrate = app.Configuration.GetValue<bool?>("Database:AutoMigrate")
    ?? app.Environment.IsDevelopment()
    || app.Environment.EnvironmentName == "Docker";

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    if (!shouldAutoMigrate)
    {
        logger.LogInformation("Skipping automatic database migrations. Set Database:AutoMigrate=true to enable.");
    }
    else
    {
        try
        {
            var context = services.GetRequiredService<AppDbContext>();

            logger.LogInformation("Applying database migrations...");
            context.Database.Migrate();
            logger.LogInformation("Database migrations completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database.");
            throw;
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Docker")
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// app.MapHub<ChatHub>("/chathub");

app.UseCors("AllowReactApp");

app.MapMethods("/ping", new[] { "GET", "HEAD" }, () => Results.Ok());

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
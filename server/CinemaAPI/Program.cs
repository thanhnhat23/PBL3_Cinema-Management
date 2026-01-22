using CinemaAPI.data;
using CinemaAPI.Services.Interfaces;
using CinemaAPI.Services.Implementations;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
});

// Configure Database Connection
var connectionString = builder.Configuration.GetConnectionString("CinemaDatabase");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// Configure MongoDB
builder.Services.AddSingleton<MongoDbContext>();

// Configure Services
builder.Services.AddScoped<IRoomService, RoomService>();
// builder.Services.AddScoped<ISnackService, SnackService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

// Configure Tmdb
builder.Services.Configure<TmdbConfig>(builder.Configuration.GetSection("TmdbConfig"));
builder.Services.AddHttpClient<ITmdbService, TmdbService>(client => {
    client.BaseAddress = new Uri(builder.Configuration["TmdbConfig:BaseUrl"]);
});

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = null; 
    }
);;

builder.Services.AddHostedService<TmdbSyncWorker>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
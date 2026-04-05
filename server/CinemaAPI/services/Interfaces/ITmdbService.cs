namespace CinemaAPI.Services.Interfaces
{
    public interface ITmdbService
    {
        Task SyncMovieAsync(string endpointType);
        Task SyncReviewsAsync();
        Task ISyncGenresAsync();
        Task SyncGenresAsync(int movieId, List<int> genreIds);
        Task SyncActorsAsync(int movieId, string tmdbMovieId);
        Task UpdateMovieStatusesAsync();
    }
}
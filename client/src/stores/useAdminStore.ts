import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface MovieStatusCount {
    status: 'released' | 'upcoming' | 'ended';
    total: number;
}

export interface MovieMonthlyCount {
    month: number;
    monthName: string;
    total: number;
}

export interface MovieGenreCount {
    genreId: number;
    genre: string;
    movie: number;
}

export const useAdminStore = create<{
    totalMovies: number;
    totalReviews: number;
    totalActors: number;
    totalGenres: number;
    movieStatusCounts: MovieStatusCount[];
    movieMonthlyCounts: MovieMonthlyCount[];
    movieGenreCounts: MovieGenreCount[];
    hasLoadedDashboardData: boolean;
    isFetchingDashboardData: boolean;
    fetchDashboardData: () => Promise<void>;
}>((set, get) => ({
    totalMovies: 0,
    totalReviews: 0,
    totalActors: 0,
    totalGenres: 0,
    movieStatusCounts: [],
    movieMonthlyCounts: [],
    movieGenreCounts: [],
    hasLoadedDashboardData: false,
    isFetchingDashboardData: false,

    fetchDashboardData: async () => {
        if (get().hasLoadedDashboardData) {
            return;
        }

        try {
            set({ isFetchingDashboardData: true });

            const [totalMoviesResponse, totalReviewsResponse, totalActorsResponse, totalGenresResponse, statusResponse, monthlyResponse, genreResponse] = await Promise.all([
                _axios.get('/v1/admin/get-total-movies'),
                _axios.get('/v1/admin/get-total-reviews'),
                _axios.get('/v1/admin/get-total-actors'),
                _axios.get('/v1/admin/get-total-genres'),
                _axios.get('/v1/admin/get-total-status'),
                _axios.get('/v1/admin/get-total-movies-by-month'),
                _axios.get('/v1/admin/get-total-movies-by-genre'),
            ]);

            set({
                totalMovies: totalMoviesResponse.data ?? 0,
                totalReviews: totalReviewsResponse.data ?? 0,
                totalActors: totalActorsResponse.data ?? 0,
                totalGenres: totalGenresResponse.data ?? 0,
                movieStatusCounts: statusResponse.data ?? [],
                movieMonthlyCounts: monthlyResponse.data ?? [],
                movieGenreCounts: genreResponse.data ?? [],
                hasLoadedDashboardData: true,
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            set({ isFetchingDashboardData: false });
        }
    },
}));
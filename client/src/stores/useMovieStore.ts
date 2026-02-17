import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface Movie {
    movie_id: number;
    tmdb_id?: string | null;
    adult?: boolean | null;
    title: string;
    overview: string;
    release_date: Date;
    end_date: Date;
    backdrop_path: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    trailer_url?: string | null;
    runtime: number;
    status: 0 | 1 | 2; // Released = 0, Upcoming = 1, Ended = 2
}

export const useMovieStore = create<{
    movies: Movie[]; // All movies
    selectedMovie: Movie | null; // Currently selected movie

    isFetchingMovies: boolean;
    isFetchingMovieDetails: boolean;
    isCreatingMovie: boolean;
    isUpdatingMovie: boolean;
    isDeletingMovie: boolean;

    fetchAllMovies: () => Promise<void>;
    fetchMovieById: (movieId: number) => Promise<void>;
    createMovie: (movieData: Partial<Movie>) => Promise<void>;
    updateMovie: (movieId: number, movieData: Partial<Movie>) => Promise<void>;
    deleteMovie: (movieId: number) => Promise<void>;
    clearSelectedMovie: () => void;
    getStatusLabel: (status: Movie['status']) => string;
}>((set) => ({
    movies: [],
    selectedMovie: null,
    isFetchingMovies: false,
    isFetchingMovieDetails: false,
    isCreatingMovie: false,
    isUpdatingMovie: false,
    isDeletingMovie: false,

    fetchAllMovies: async () => {
        const currentMovies = useMovieStore.getState().movies;
        // Skip if already fetched
        if (currentMovies.length > 0) return;
        
        try {
            set({ isFetchingMovies: true });

            const response = await _axios.get('/v1/movie/get-all');

            if (response.data) {
                set({ movies: response.data });
            }
        } catch (error) {
            console.error('Error fetching all movies:', error);
        } finally {
            set({ isFetchingMovies: false });
        }
    },

    fetchMovieById: async (movieId: number) => {
        try {
            set({ isFetchingMovieDetails: true });

            const response = await _axios.get(`/v1/movie/get/${movieId}`);

            if (response.data) {
                set({ selectedMovie: response.data });
            }
        } catch (error) {
            console.error(`Error fetching movie with ID ${movieId}:`, error);
        } finally {
            set({ isFetchingMovieDetails: false });
        }
    },

    createMovie: async (movieData: Partial<Movie>) => {
        try {
            set({ isCreatingMovie: true });

            const response = await _axios.post('/v1/movie/create', movieData);

            if (response.data?.data) {  
                set((state) => ({ movies: [...state.movies, response.data.data] }));
            }
        } catch (error) {
            console.error('Error creating movie:', error);
        } finally {
            set({ isCreatingMovie: false });
        }
    },

    updateMovie: async (movieId: number, movieData: Partial<Movie>) => {
        try {
            set({ isUpdatingMovie: true });

            const response = await _axios.put(`/v1/movie/update/${movieId}`, movieData);

            if (response.data?.data) {
                set((state) => ({
                    movies: state.movies.map((movie) =>
                        movie.movie_id === movieId ? response.data.data : movie
                    ),
                    selectedMovie: response.data.data,
                }));
            }
        } catch (error) {
            console.error(`Error updating movie with ID ${movieId}:`, error);
        } finally {
            set({ isUpdatingMovie: false });
        }
    },

    deleteMovie: async (movieId: number) => {
        try {
            set({ isDeletingMovie: true });

            await _axios.delete(`/v1/movie/delete/${movieId}`);
            set((state) => ({
                movies: state.movies.filter((movie) => movie.movie_id !== movieId),
                selectedMovie: state.selectedMovie?.movie_id === movieId ? null : state.selectedMovie,
            }));
        } catch (error) {
            console.error(`Error deleting movie with ID ${movieId}:`, error);
        } finally {
            set({ isDeletingMovie: false });
        }
    },

    clearSelectedMovie: () => {
        set({ selectedMovie: null });
    },

    getStatusLabel: (status: Movie['status']) => {
        switch (status) {
            case 0:
                return 'Released';
            case 1:
                return 'Upcoming';
            case 2:
                return 'Ended';
            default:
                return 'Unknown';
        }
    },

    filterMoviesByStatus: (status: 0 | 1 | 2) => {
        set((state) => ({
            movies: state.movies.filter(m => m.status === status)
        }));
    },
}));
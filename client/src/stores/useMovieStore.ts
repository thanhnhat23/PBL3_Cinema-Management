import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

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

export interface ActorWithMovie {
    Actor: {
        actor_id: number;
        name: string;
        biography?: string | null;
        birthday?: Date | null;
        place_of_birth?: string | null;
        profile_path?: string | null;
        gender?: number | null;
    };
    char_name: string;
    order: number;
}

export const useMovieStore = create<{
    movies: Movie[]; // All movies
    moviesByStatus: Movie[];
    moviesByStatusMap: Partial<Record<Movie['status'], Movie[]>>;
    moviesByGenre: Movie[];
    popularMovies: Movie[];
    actorWithMovies: ActorWithMovie[];
    selectedMovie: Movie | null; // Currently selected movie

    isFetchingMovies: boolean;
    isFetchingMoviesByGenre: boolean;
    isFetchingMoviesByStatus: boolean;
    isFetchingPopularMovies: boolean;
    isFetchingMovieDetails: boolean;
    isUpdatingMovie: boolean;
    isFetchingActorWithMovies: boolean;

    fetchAllMovies: () => Promise<void>;
    fetchMoviesByGenre: (genreId: number, limit?: number) => Promise<void>;
    fetchMoviesByStatus: (status: Movie['status'], limit?: number) => Promise<void>;
    fetchPopularMovies: (limit?: number) => Promise<void>;
    fetchMovieById: (movieId: number) => Promise<void>;
    updateMovie: (movieId: number, movieData: Partial<Movie>) => Promise<Movie | null>;
    fetchActorWithMovies: (movieId: number) => Promise<void>;
    clearSelectedMovie: () => void;
    clearActorWithMovies: () => void;
    getStatusLabel: (status: Movie['status']) => string;
}>((set) => ({
    movies: [],
    moviesByStatus: [],
    moviesByStatusMap: {},
    moviesByGenre: [],
    popularMovies: [],
    actorWithMovies: [],
    selectedMovie: null,
    isFetchingMovies: false,
    isFetchingMoviesByGenre: false,
    isFetchingMoviesByStatus: false,
    isFetchingPopularMovies: false,
    isFetchingMovieDetails: false,
    isUpdatingMovie: false,
    isFetchingActorWithMovies: false,

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

    fetchMoviesByGenre: async (genreId: number, limit: number = 1000) => {
        try {
            set({ isFetchingMoviesByGenre: true });

            const response = await _axios.get('/v1/movie/get-by-genre', {
                params: { genreId, limit },
            });

            if (response.data) {
                set({ moviesByGenre: response.data });
            }
        } catch (error) {
            console.error(`Error fetching movies by genre ${genreId}:`, error);
            set({ moviesByGenre: [] });
        } finally {
            set({ isFetchingMoviesByGenre: false });
        }
    },

    fetchMoviesByStatus: async (status: Movie['status'], limit: number = 8) => {
        try {
            set({ isFetchingMoviesByStatus: true });

            const response = await _axios.get('/v1/movie/get-by-status', {
                params: { status, limit },
            });

            if (response.data) {
                set((state) => ({
                    moviesByStatus: response.data,
                    moviesByStatusMap: {
                        ...state.moviesByStatusMap,
                        [status]: response.data,
                    },
                }));
            }
        } catch (error) {
            console.error(`Error fetching movies by status ${status}:`, error);
        } finally {
            set({ isFetchingMoviesByStatus: false });
        }
    },

    fetchPopularMovies: async (limit: number = 8) => {
        try {
            set({ isFetchingPopularMovies: true });

            const response = await _axios.get('/v1/movie/get-popular', {
                params: { limit },
            });

            if (response.data) {
                set({ popularMovies: response.data });
            }
        } catch (error) {
            console.error('Error fetching popular movies:', error);
        } finally {
            set({ isFetchingPopularMovies: false });
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

    updateMovie: async (movieId: number, movieData: Partial<Movie>) => {
        try {
            set({ isUpdatingMovie: true });

            const response = await _axios.put(`/v1/movie/update/${movieId}`, movieData);
            const updatedMovie = response.data?.data ?? response.data ?? null;

            if (updatedMovie) {
                set((state) => ({
                    movies: state.movies.map((movie) =>
                        movie.movie_id === movieId ? updatedMovie : movie
                    ),
                    selectedMovie: updatedMovie,
                }));
                addToast({
                    title: i18n.t('common.success'),
                    description: i18n.t('toasts.movie.update_success'),
                    color: "success",
                    variant: "flat"
                });
            }

            return updatedMovie;
        } catch (error) {
            console.error(`Error updating movie with ID ${movieId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.movie.update_error'),
                color: "danger",
                variant: "flat"
            });
            return null;
        } finally {
            set({ isUpdatingMovie: false });
        }
    },

    fetchActorWithMovies: async (movieId: number) => {
        try {
            set({ isFetchingActorWithMovies: true });

            const response = await _axios.get(`/v1/movie/get-actor-with-movies/${movieId}`);

            if (response.data) {
                set({ actorWithMovies: response.data });
            }
        } catch (error) {
            console.error(`Error fetching actors with movie ID ${movieId}:`, error);
        } finally {
            set({ isFetchingActorWithMovies: false });
        }
    },

    clearSelectedMovie: () => {
        set({ selectedMovie: null });
    },

    clearActorWithMovies: () => {
        set({ actorWithMovies: [] });
    },

    getStatusLabel: (status: Movie['status']) => {
        switch (status) {
            case 0:
                return 'released';
            case 1:
                return 'upcoming';
            case 2:
                return 'ended';
            default:
                return 'unknown';
        }
    },
}));
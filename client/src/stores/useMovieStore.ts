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
    popularMovies: Movie[];
    actorWithMovies: ActorWithMovie[];
    selectedMovie: Movie | null; // Currently selected movie

    isFetchingMovies: boolean;
    isFetchingMoviesByStatus: boolean;
    isFetchingPopularMovies: boolean;
    isFetchingMovieDetails: boolean;
    isCreatingMovie: boolean;
    isUpdatingMovie: boolean;
    isDeletingMovie: boolean;
    isFetchingActorWithMovies: boolean;

    fetchAllMovies: () => Promise<void>;
    fetchMoviesByStatus: (status: Movie['status'], limit?: number) => Promise<void>;
    fetchPopularMovies: (limit?: number) => Promise<void>;
    fetchMovieById: (movieId: number) => Promise<void>;
    createMovie: (movieData: Partial<Movie>) => Promise<void>;
    updateMovie: (movieId: number, movieData: Partial<Movie>) => Promise<Movie | null>;
    deleteMovie: (movieId: number) => Promise<void>;
    fetchActorWithMovies: (movieId: number) => Promise<void>;
    clearSelectedMovie: () => void;
    clearActorWithMovies: () => void;
    getStatusLabel: (status: Movie['status']) => string;
}>((set) => ({
    movies: [],
    moviesByStatus: [],
    moviesByStatusMap: {},
    popularMovies: [],
    actorWithMovies: [],
    selectedMovie: null,
    isFetchingMovies: false,
    isFetchingMoviesByStatus: false,
    isFetchingPopularMovies: false,
    isFetchingMovieDetails: false,
    isCreatingMovie: false,
    isUpdatingMovie: false,
    isDeletingMovie: false,
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
            const updatedMovie = response.data?.data ?? response.data ?? null;

            if (updatedMovie) {
                set((state) => ({
                    movies: state.movies.map((movie) =>
                        movie.movie_id === movieId ? updatedMovie : movie
                    ),
                    selectedMovie: updatedMovie,
                }));
            }

            return updatedMovie;
        } catch (error) {
            console.error(`Error updating movie with ID ${movieId}:`, error);
            return null;
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
                return 'Released';
            case 1:
                return 'Upcoming';
            case 2:
                return 'Ended';
            default:
                return 'Unknown';
        }
    },
}));
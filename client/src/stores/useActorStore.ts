import { create } from "zustand";
import { _axios } from "@/lib/axios";
import { Movie } from './useMovieStore';

export interface Actor {
    actor_id: number;
    Movie?: Movie | null;
    name: string;
    biography?: string | null;
    birthday?: Date | null;
    place_of_birth?: string | null;
    profile_path?: string | null;
    gender?: number | null; // 1 for female, 2 for male
    char_name?: string | null;
}

export type ActorUpdatePayload = Omit<Partial<Actor>, "birthday"> & {
    birthday?: string | null;
};

export const useActorStore = create<{
    actors: Actor[]; // All actors
    movieWithActors: Actor[];
    characterWithActors: Actor[];
    selectedActor: Actor | null; // Currently selected actor

    isFetchingActors: boolean;
    isFetchingActorDetails: boolean;
    isUpdateingActor: boolean;

    fetchAllActors: () => Promise<void>;
    fetchActorById: (actorId: number) => Promise<Actor | null>;
    updateActor: (actorId: number, actorData: ActorUpdatePayload) => Promise<void>;
    fetchMovieWithActors: (movieId: number) => Promise<void>;
    fetchCharacterWithActors: (movieId: number) => Promise<void>;
    clearSelectedActor: () => void;
}>((set) => ({
    actors: [],
    movieWithActors: [],
    characterWithActors: [],
    selectedActor: null,
    isFetchingActors: false,
    isFetchingActorDetails: false,
    isUpdateingActor: false,

    fetchAllActors: async () => {
        const currentActors = useActorStore.getState().actors;
        // Skip if already fetched
        if (currentActors.length > 0) return;
        
        try {
            set({ isFetchingActors: true });

            const response = await _axios.get('/v1/actor/get-all');

            if (response.data) {
                set({ actors: response.data });
            }
        } catch (error) {
            console.error('Error fetching actors:', error);
        } finally {
            set({ isFetchingActors: false });
        }

    },

    fetchActorById: async (actorId: number) => {
        try {
            set({ isFetchingActorDetails: true });
            const response = await _axios.get(`/v1/actor/get/${actorId}`);

            if (response.data) {
                set({ selectedActor: response.data });
                return response.data;
            }

            return null;
        } catch (error) {
            console.error(`Error fetching actor with ID ${actorId}:`, error);
            return null;
        } finally {
            set({ isFetchingActorDetails: false });
        }
    },

    updateActor: async (actorId: number, actorData: ActorUpdatePayload) => {
        try {
            set({ isUpdateingActor: true });
            await _axios.put(`/v1/actor/update/${actorId}`, actorData);

            const refreshedActor = await useActorStore.getState().fetchActorById(actorId);

            if (refreshedActor) {
                set((state) => ({
                    actors: state.actors.map((actor) =>
                        actor.actor_id === actorId ? refreshedActor : actor
                    ),
                }));
            }
        } catch (error) {
            console.error(`Error updating actor with ID ${actorId}:`, error);
        } finally {
            set({ isUpdateingActor: false });
        }   
    },

    fetchMovieWithActors: async (movieId: number) => {
        try {
            const response = await _axios.get(`/v1/actor/get-movie-with-actors/${movieId}`);
            
            if (response.data) {
                set({ movieWithActors: response.data });
            }
        } catch (error) {
            console.error(`Error fetching actors for movie with ID ${movieId}:`, error);
        }
    },

    fetchCharacterWithActors: async (movieId: number) => {
        try {
            const response = await _axios.get(`/v1/actor/get-character-with-actors/${movieId}`);

            if (response.data) {
                set({ characterWithActors: response.data });
            }
        } catch (error) {
            console.error(`Error fetching characters with actors for movie with ID ${movieId}:`, error);
        }
    },

    clearSelectedActor: () => {
        set({ selectedActor: null });
    },
}));
import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface ShowTime {
    showtime_id: number;
    room_id: number;
    movie_id: number;
    cinema_id?: number | null;
    slot_id?: number | null;
    pricing_model: number; // 0=PriceBased, 1=SeatBased, 2=Mixed
    startTime: string;
    endTime: string;
    deleted_at?: string | null;
    deleted_by?: string | null;
    Room?: { room_id: number; nameRoom?: string; Cinema?: { name?: string } } | null;
    Movie?: { movie_id: number; title?: string } | null;
    Slot?: { slot_id: number; dayOfWeek: number; startTime: string; endTime: string } | null;
}

export const useShowTimeStore = create<{
    showtimes: ShowTime[];
    selectedShowtime: ShowTime | null;

    isFetching: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;

    fetchAllShowtimes: () => Promise<void>;
    fetchShowtimeById: (id: number) => Promise<void>;
    createShowtime: (payload: { room_id: number; movie_id: number; startTime: string; endTime: string; slot_id?: number | null; pricing_model?: number }) => Promise<void>;
    createShowtimeFromSlot: (payload: { room_id: number; movie_id: number; slot_id: number; date: string; pricing_model?: number }) => Promise<ShowTime | void>;
    updateShowtime: (id: number, payload: Partial<ShowTime & { slot_id?: number | null; pricing_model?: number }>) => Promise<void>;
    deleteShowtime: (id: number) => Promise<void>;
    clearSelected: () => void;
}>((set) => ({
    showtimes: [],
    selectedShowtime: null,

    isFetching: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    fetchAllShowtimes: async () => {
        try {
            set({ isFetching: true });
            const res = await _axios.get('/v1/showtime/get-all');
            if (res.data) {
                set({ showtimes: res.data as ShowTime[] });
                console.log('Showtimes fetched:', res.data);
            }
        } catch (err) {
            console.error('Error fetching showtimes', err);
        } finally {
            set({ isFetching: false });
        }
    },

    fetchShowtimeById: async (id: number) => {
        try {
            set({ isFetching: true });
            const res = await _axios.get(`/v1/showtime/get/${id}`);
            if (res.data) set({ selectedShowtime: res.data as ShowTime });
        } catch (err) {
            console.error(`Error fetching showtime ${id}`, err);
        } finally {
            set({ isFetching: false });
        }
    },

    createShowtime: async (payload) => {
        try {
            set({ isCreating: true });
            await _axios.post('/v1/showtime/create', payload);
            // invalidate list to force refetch later
            set({ showtimes: [] });
        } catch (err) {
            console.error('Error creating showtime', err);
        } finally {
            set({ isCreating: false });
        }
    },

    createShowtimeFromSlot: async (payload) => {
        try {
            set({ isCreating: true });
            const res = await _axios.post('/v1/showtime/create-from-slot', payload);
            if (res.data) {
                const newShowtime = res.data as ShowTime;
                set((state) => ({
                    showtimes: [...state.showtimes, newShowtime],
                    selectedShowtime: newShowtime,
                }));
                return newShowtime;
            }
        } catch (err) {
            console.error('Error creating showtime from slot', err);
        } finally {
            set({ isCreating: false });
        }
    },

    updateShowtime: async (id, payload) => {
        try {
            set({ isUpdating: true });
            await _axios.put(`/v1/showtime/update/${id}`, payload);
            set((state) => ({
                showtimes: state.showtimes.map((s) => (s.showtime_id === id ? { ...s, ...payload } as ShowTime : s)),
                selectedShowtime: state.selectedShowtime?.showtime_id === id ? { ...state.selectedShowtime, ...payload } as ShowTime : state.selectedShowtime,
            }));
        } catch (err) {
            console.error(`Error updating showtime ${id}`, err);
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteShowtime: async (id) => {
        try {
            set({ isDeleting: true });
            await _axios.delete(`/v1/showtime/delete/${id}`);
            set((state) => ({ showtimes: state.showtimes.filter((s) => s.showtime_id !== id) }));
        } catch (err) {
            console.error(`Error deleting showtime ${id}`, err);
        } finally {
            set({ isDeleting: false });
        }
    },

    clearSelected: () => set({ selectedShowtime: null }),
}));

export default useShowTimeStore;

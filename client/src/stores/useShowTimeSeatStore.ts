import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface ShowTimeSeat {
    stseat_id: number;
    seat_id: number;
    showtime_id: number;
    booking_id?: number | null;
    status: number;
    Seat?: { seat_code?: string };
}

export const useShowTimeSeatStore = create<{
    seats: ShowTimeSeat[];
    selected: ShowTimeSeat | null;
    isFetching: boolean;
    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    createSeat: (payload: Partial<ShowTimeSeat>) => Promise<void>;
    updateSeat: (id: number, payload: Partial<ShowTimeSeat>) => Promise<void>;
    deleteSeat: (id: number) => Promise<void>;
}>((set) => ({
    seats: [],
    selected: null,
    isFetching: false,
    fetchAll: async () => {
        try {
            set({ isFetching: true });
            const res = await _axios.get('/v1/showtimeSeat/get-all');
            if (res.data) set({ seats: res.data as ShowTimeSeat[] });
        } catch (err) {
            console.error('fetch showtime seats', err);
        } finally { set({ isFetching: false }); }
    },
    fetchById: async (id) => {
        try { set({ isFetching: true }); const res = await _axios.get(`/v1/showtimeSeat/get/${id}`); if (res.data) set({ selected: res.data as ShowTimeSeat }); }
        catch (err) { console.error(err); } finally { set({ isFetching: false }); }
    },
    createSeat: async (payload) => { try { await _axios.post('/v1/showtimeSeat/create', payload); set({ seats: [] }); } catch (err) { console.error(err); } },
    updateSeat: async (id, payload) => { try { await _axios.put(`/v1/showtimeSeat/update/${id}`, payload); set((s) => ({ seats: s.seats.map(x => x.stseat_id === id ? { ...x, ...payload } as ShowTimeSeat : x) })); } catch (err) { console.error(err); } },
    deleteSeat: async (id) => { try { await _axios.delete(`/v1/showtimeSeat/delete/${id}`); set((s) => ({ seats: s.seats.filter(x => x.stseat_id !== id) })); } catch (err) { console.error(err); } },
}));

export default useShowTimeSeatStore;

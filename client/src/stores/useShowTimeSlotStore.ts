import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export enum ShowTimeSlotStatus {
    Draft = 0,
    Scheduled = 1,
    Published = 2,
    Cancelled = 3
}

export interface ShowTimeSlot {
    slot_id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    reusable: boolean;
    status: ShowTimeSlotStatus;
}

export const useShowTimeSlotStore = create<{
    slots: ShowTimeSlot[];
    isFetching: boolean;
    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<ShowTimeSlot | null>;
    createSlot: (payload: Partial<ShowTimeSlot>) => Promise<void>;
    updateSlot: (id: number, payload: Partial<ShowTimeSlot>) => Promise<void>;
    deleteSlot: (id: number) => Promise<void>;
}>((set) => ({
    slots: [],
    isFetching: false,
    
    fetchAll: async () => {
        try {
            set({ isFetching: true });
            const res = await _axios.get('/v1/showtimeSlot/get-all');
            if (res.data) set({ slots: res.data as ShowTimeSlot[] });
        } catch (error) {
            console.error('fetch slots error', error);
        } finally {
            set({ isFetching: false });
        }
    },

    fetchById: async (id: number) => {
        try {
            const res = await _axios.get(`/v1/showtimeSlot/get/${id}`);
            return res.data as ShowTimeSlot;
        } catch (error) {
            console.error('fetch slot error', error);
            return null;
        }
    },

    createSlot: async (payload) => {
        try {
            await _axios.post('/v1/showtimeSlot/create', payload);
            set({ slots: [] });
        } catch (error) {
            console.error('create slot error:', error);
        }
    },

    updateSlot: async (id, payload) => {
        try {
            await _axios.put(`/v1/showtimeSlot/update/${id}`, payload);
            set((s) => ({
                slots: s.slots.map(x => x.slot_id === id ? { ...x, ...payload } as ShowTimeSlot : x)
            }));
        } catch (error) {
            console.error('update slot error:', error);
        }
    },

    deleteSlot: async (id) => {
        try {
            await _axios.delete(`/v1/showtimeSlot/delete/${id}`);
            set((s) => ({
                slots: s.slots.filter(x => x.slot_id !== id)
            }));
        } catch (error) {
            console.error('delete slot error:', error);
        }
    }
}));

export default useShowTimeSlotStore;

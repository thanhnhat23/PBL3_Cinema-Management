import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

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
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.showtime_slot.add_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error('create slot error:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.showtime_slot.add_error'),
                color: "danger",
                variant: "flat"
            });
        }
    },

    updateSlot: async (id, payload) => {
        try {
            await _axios.put(`/v1/showtimeSlot/update/${id}`, payload);
            set((s) => ({
                slots: s.slots.map(x => x.slot_id === id ? { ...x, ...payload } as ShowTimeSlot : x)
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.showtime_slot.update_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error('update slot error:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.showtime_slot.update_error'),
                color: "danger",
                variant: "flat"
            });
        }
    },

    deleteSlot: async (id) => {
        try {
            await _axios.delete(`/v1/showtimeSlot/delete/${id}`);
            set((s) => ({
                slots: s.slots.filter(x => x.slot_id !== id)
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.showtime_slot.delete_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error('delete slot error:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.showtime_slot.delete_error'),
                color: "danger",
                variant: "flat"
            });
        }
    }
}));

export default useShowTimeSlotStore;

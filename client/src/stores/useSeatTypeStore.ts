import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface SeatType {
    type_id: number;
    type_name: string | number; // Enum value or string
    price: number;
}

export const useSeatTypeStore = create<{
    seatTypes: SeatType[];
    isFetching: boolean;
    fetchAll: () => Promise<void>;
    updatePrice: (typeId: number, price: number) => Promise<void>;
}>((set) => ({
    seatTypes: [],
    isFetching: false,
    fetchAll: async () => {
        try {
            set({ isFetching: true });
            const res = await _axios.get('/v1/seat/types');
            if (res.data) set({ seatTypes: res.data as SeatType[] });
        } catch (err) {
            console.error(err);
        } finally {
            set({ isFetching: false });
        }
    },
    updatePrice: async (typeId, price) => {
        try {
            await _axios.put(`/v1/seat/types/${typeId}/price`, { price });
            set((s) => ({
                seatTypes: s.seatTypes.map((t) => (t.type_id === typeId ? { ...t, price } : t)),
            }));
        } catch (err) {
            console.error(err);
        }
    },
}));

export default useSeatTypeStore;

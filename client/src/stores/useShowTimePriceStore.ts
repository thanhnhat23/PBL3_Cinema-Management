import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface ShowTimePrice {
    type_id: number;
    showtime_id: number;
    base_price: number;
}

export const useShowTimePriceStore = create<{
    prices: ShowTimePrice[];
    isFetching: boolean;
    fetchAll: () => Promise<void>;
    fetchPrice: (typeId: number, showtimeId: number) => Promise<void>;
    createPrice: (payload: ShowTimePrice) => Promise<void>;
    updatePrice: (typeId: number, showtimeId: number, payload: Partial<ShowTimePrice>) => Promise<void>;
    deletePrice: (typeId: number, showtimeId: number) => Promise<void>;
}>((set) => ({
    prices: [],
    isFetching: false,
    fetchAll: async () => {
        try { set({ isFetching: true }); const res = await _axios.get('/v1/showtimePrice/get-all'); if (res.data) set({ prices: res.data as ShowTimePrice[] }); }
        catch (err) { console.error(err); } finally { set({ isFetching: false }); }
    },
    fetchPrice: async (typeId, showtimeId) => { try { set({ isFetching: true }); const res = await _axios.get(`/v1/showtimePrice/get/${typeId}/${showtimeId}`); if (res.data) set((s) => ({ prices: [...s.prices.filter(p => !(p.type_id === typeId && p.showtime_id === showtimeId)), res.data] })); } catch (err) { console.error(err); } finally { set({ isFetching: false }); } },
    createPrice: async (payload) => { try { await _axios.post('/v1/showtimePrice/create', payload); set({ prices: [] }); } catch (err) { console.error(err); } },
    updatePrice: async (typeId, showtimeId, payload) => { try { await _axios.put(`/v1/showtimePrice/update/${typeId}/${showtimeId}`, payload); set((s) => ({ prices: s.prices.map(p => p.type_id === typeId && p.showtime_id === showtimeId ? { ...p, ...payload } as ShowTimePrice : p) })); } catch (err) { console.error(err); } },
    deletePrice: async (typeId, showtimeId) => { try { await _axios.delete(`/v1/showtimePrice/delete/${typeId}/${showtimeId}`); set((s) => ({ prices: s.prices.filter(p => !(p.type_id === typeId && p.showtime_id === showtimeId)) })); } catch (err) { console.error(err); } },
}));

export default useShowTimePriceStore;

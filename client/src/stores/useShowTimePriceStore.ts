import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface ShowTimePrice {
    type_id: number;
    slot_id: number;
    base_price: number;
}

export const useShowTimePriceStore = create<{
    prices: ShowTimePrice[];
    isFetching: boolean;
    fetchAll: () => Promise<void>;
    fetchPrice: (typeId: number, slotId: number) => Promise<void>;
    createPrice: (payload: ShowTimePrice) => Promise<void>;
    updatePrice: (typeId: number, slotId: number, payload: Partial<ShowTimePrice>) => Promise<void>;
    deletePrice: (typeId: number, slotId: number) => Promise<void>;
}>((set) => ({
    prices: [],
    isFetching: false,
    fetchAll: async () => {
        try { 
            set({ isFetching: true }); 
            const res = await _axios.get('/v1/showtimePrice/get-all'); 
            if (res.data) set({ prices: res.data as ShowTimePrice[] }); 
        }
        catch (err) { console.error(err); } 
        finally { set({ isFetching: false }); }
    },

    fetchPrice: async (typeId, slotId) => { 
        try { 
            set({ isFetching: true }); 
            const res = await _axios.get(`/v1/showtimePrice/get/${typeId}/${slotId}`); 
            if (res.data) set((s) => ({ prices: [...s.prices.filter(p => !(p.type_id === typeId && p.slot_id === slotId)), res.data] })); 
        } catch (err) { 
            console.error(err); 
        } finally { 
            set({ isFetching: false }); 
        } 
    },

    createPrice: async (payload) => { 
        try { 
            await _axios.post('/v1/showtimePrice/create', payload); 
            set({ prices: [] }); 
        } catch (err) { console.error(err); } 
    },
    
    updatePrice: async (typeId, slotId, payload) => { 
        try { 
            await _axios.put(`/v1/showtimePrice/update/${typeId}/${slotId}`, payload); 
            set((s) => ({ prices: s.prices.map(p => p.type_id === typeId && p.slot_id === slotId ? { ...p, ...payload } as ShowTimePrice : p) })); 
        } catch (err) { console.error(err); } 
    },
    
    deletePrice: async (typeId, slotId) => { 
        try { 
            await _axios.delete(`/v1/showtimePrice/delete/${typeId}/${slotId}`); 
            set((s) => ({ prices: s.prices.filter(p => !(p.type_id === typeId && p.slot_id === slotId)) })); 
        } catch (err) { console.error(err); } 
    },
}));

export default useShowTimePriceStore;

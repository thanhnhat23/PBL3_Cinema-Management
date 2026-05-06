import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import type { Snack } from './useSnackStore';

export interface ComboComponent {
    combo_id: number;
    snack_id: number;
    quantity: number;
    snack?: Snack;
}

export const useComboStore = create<{
    comboDetails: ComboComponent[];
    combosById: Record<number, ComboComponent[]>;

    isFetchingCombos: boolean;
    isFetchingComboDetails: boolean;

    fetchAllComboDetails: () => Promise<void>;
    fetchComboDetailsByCombo: (comboId: number) => Promise<ComboComponent[] | null>;
    createComboDetail: (data: { combo_id: number; snack_id: number; quantity: number }) => Promise<boolean>;
    updateComboDetail: (combo_id: number, snack_id: number, data: { quantity?: number }) => Promise<boolean>;
    deleteComboDetail: (combo_id: number, snack_id: number) => Promise<boolean>;
}>((set, get) => ({
    comboDetails: [],
    combosById: {},

    isFetchingCombos: false,
    isFetchingComboDetails: false,

    fetchAllComboDetails: async () => {
        try {
            set({ isFetchingCombos: true });
            const res = await _axios.get('/v1/combodetail/get-all');
            if (res.data) {
                const data = res.data as ComboComponent[];
                const grouped: Record<number, ComboComponent[]> = {};
                data.forEach((c) => {
                    if (!grouped[c.combo_id]) grouped[c.combo_id] = [];
                    grouped[c.combo_id].push(c);
                });
                set({ comboDetails: data, combosById: grouped });
            }
        } catch (error) {
            console.error('Error fetching all combo details:', error);
        } finally {
            set({ isFetchingCombos: false });
        }
    },

    fetchComboDetailsByCombo: async (comboId: number) => {
        try {
            set({ isFetchingComboDetails: true });
            const res = await _axios.get(`/v1/combodetail/get/${comboId}`);
            if (res.data) {
                const items = res.data as ComboComponent[];
                set((state) => ({ comboDetails: [...state.comboDetails.filter(x => x.combo_id !== comboId), ...items], combosById: { ...state.combosById, [comboId]: items } }));
                return items;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching combo details for combo ${comboId}:`, error);
            return null;
        } finally {
            set({ isFetchingComboDetails: false });
        }
    },

    createComboDetail: async (data) => {
        try {
            const res = await _axios.post('/v1/combodetail/create', data);
            if (res.status === 200) {
                // Refresh that combo
                await get().fetchComboDetailsByCombo(data.combo_id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error creating combo detail:', error);
            return false;
        }
    },

    updateComboDetail: async (combo_id, snack_id, data) => {
        try {
            const res = await _axios.put(`/v1/combodetail/update/${combo_id}/${snack_id}`, data);
            if (res.status === 200) {
                await get().fetchComboDetailsByCombo(combo_id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating combo detail:', error);
            return false;
        }
    },

    deleteComboDetail: async (combo_id, snack_id) => {
        try {
            const res = await _axios.delete(`/v1/combodetail/delete/${combo_id}/${snack_id}`);
            if (res.status === 200) {
                await get().fetchComboDetailsByCombo(combo_id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting combo detail:', error);
            return false;
        }
    },
}));

export default useComboStore;

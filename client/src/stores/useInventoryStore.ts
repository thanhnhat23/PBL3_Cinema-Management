import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';
import type { Snack } from './useSnackStore';

export interface Inventory {
    snack_id: number;
    cinema_id: number;
    quantity: number;
    snack?: Snack;
}

export const useInventoryStore = create<{
    inventories: Inventory[];
    isFetchingInventories: boolean;

    fetchAllInventories: () => Promise<void>;
    fetchInventory: (cinemaId: number, snackId: number) => Promise<Inventory | null>;
    createInventory: (data: { cinema_id: number; snack_id: number; quantity: number }) => Promise<boolean>;
    updateInventory: (cinemaId: number, snackId: number, data: { quantity: number }) => Promise<boolean>;
}>((set, get) => ({
    inventories: [],
    isFetchingInventories: false,

    fetchAllInventories: async () => {
        try {
            set({ isFetchingInventories: true });
            const res = await _axios.get('/v1/inventory/get-all');
            if (res.data) {
                set({ inventories: res.data as Inventory[] });
            }
        } catch (error) {
            console.error('Error fetching inventories:', error);
        } finally {
            set({ isFetchingInventories: false });
        }
    },

    fetchInventory: async (cinemaId: number, snackId: number) => {
        try {
            const res = await _axios.get(`/v1/inventory/get/${cinemaId}/${snackId}`);
            if (res.data) {
                const item = res.data as Inventory;
                set((state) => ({ inventories: [...state.inventories.filter(i => !(i.cinema_id === cinemaId && i.snack_id === snackId)), item] }));
                return item;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching inventory for cinema ${cinemaId} snack ${snackId}:`, error);
            return null;
        }
    },

    createInventory: async (data) => {
        try {
            const res = await _axios.post('/v1/inventory/create', data);
            if (res.status === 200) {
                await get().fetchInventory(data.cinema_id, data.snack_id);
                addToast({
                    title: i18n.t('common.success'),
                    description: i18n.t('toasts.inventory.update_success'),
                    color: "success",
                    variant: "flat"
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error creating inventory:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.inventory.update_error'),
                color: "danger",
                variant: "flat"
            });
            return false;
        }
    },

    updateInventory: async (cinemaId, snackId, data) => {
        try {
            const res = await _axios.put(`/v1/inventory/update/${cinemaId}/${snackId}`, data);
            if (res.status === 200) {
                await get().fetchInventory(cinemaId, snackId);
                addToast({
                    title: i18n.t('common.success'),
                    description: i18n.t('toasts.inventory.update_success'),
                    color: "success",
                    variant: "flat"
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating inventory:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.inventory.update_error'),
                color: "danger",
                variant: "flat"
            });
            return false;
        }
    },
}));

export default useInventoryStore;

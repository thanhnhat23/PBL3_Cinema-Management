import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

export interface DeletedItem {
    id: string;
    name: string;
    type: string;
    deletedAt: string;
    deletedByUserId?: string;
    deletedByUserName?: string;
    deletedByAvatarPath?: string;
}

interface TrashStore {
    deletedItems: DeletedItem[];
    isLoading: boolean;
    fetchDeletedItems: () => Promise<void>;
    restoreItem: (type: string, id: string) => Promise<void>;
    hardDeleteItem: (type: string, id: string) => Promise<void>;
}

export const useTrashStore = create<TrashStore>((set, get) => ({
    deletedItems: [],
    isLoading: false,

    fetchDeletedItems: async () => {
        set({ isLoading: true });
        try {
            const response = await _axios.get('/v1/admin/get-deleted-items');
            const mappedItems = (response.data || []).map((item: any) => ({
                id: item.Id ?? item.id,
                name: item.Name ?? item.name,
                type: item.Type ?? item.type,
                deletedAt: item.DeletedAt ?? item.deletedAt,
                deletedByUserId: item.DeletedByUserId ?? item.deletedByUserId,
                deletedByUserName: item.DeletedByUserName ?? item.deletedByUserName,
                deletedByAvatarPath: item.DeletedByAvatarPath ?? item.deletedByAvatarPath,
            }));
            set({ deletedItems: mappedItems, isLoading: false });
        } catch (error: any) {
            console.error('Error fetching deleted items:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.trash.fetch_error'),
                color: "danger",
                variant: "flat"
            });
            set({ isLoading: false });
        }
    },

    restoreItem: async (type, id) => {
        try {
            await _axios.post(`/v1/admin/restore-item/${type}/${id}`);
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.trash.restore_success'),
                color: "success",
                variant: "flat"
            });
            get().fetchDeletedItems();
        } catch (error: any) {
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.trash.restore_error'),
                color: "danger",
                variant: "flat"
            });
        }
    },

    hardDeleteItem: async (type, id) => {
        try {
            await _axios.delete(`/v1/admin/hard-delete-item/${type}/${id}`);
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.trash.hard_delete_success'),
                color: "success",
                variant: "flat"
            });
            get().fetchDeletedItems();
        } catch (error: any) {
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.trash.hard_delete_error'),
                color: "danger",
                variant: "flat"
            });
        }
    }
}));

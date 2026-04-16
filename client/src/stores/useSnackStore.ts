import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface Snack {
    snack_id: number;
    name: string;
    type: 0 | 1 | 2; // Food = 0, Drink = 1, Combo = 2
    price: number;
    imageUrl?: string | null;
}

export const useSnackStore = create<{
    snacks: Snack[];
    selectedSnack: Snack | null;

    isFetchingSnacks: boolean;
    isFetchingSnackDetails: boolean;
    isCreatingSnack: boolean;
    isUpdatingSnack: boolean;
    isDeletingSnack: boolean;

    fetchAllSnacks: () => Promise<void>;
    fetchSnackById: (snackId: number) => Promise<void>;
    createSnack: (snackData: Partial<Snack>) => Promise<void>;
    updateSnack: (snackId: number, snackData: Partial<Snack>) => Promise<void>;
    deleteSnack: (snackId: number) => Promise<void>;
    clearSelectedSnack: () => void;
}>((set) => ({
    snacks: [],
    selectedSnack: null,
    isFetchingSnacks: false,
    isFetchingSnackDetails: false,
    isCreatingSnack: false,
    isUpdatingSnack: false,
    isDeletingSnack: false,

    fetchAllSnacks: async () => {
        const currentSnacks = useSnackStore.getState().snacks;
        // Skip if already fetched
        if (currentSnacks.length > 0) return;

        try {
            set({ isFetchingSnacks: true });

            const response = await _axios.get('/v1/snack/get-all');

            if (response.data) {
                set({ snacks: response.data });
            }
        } catch (error) {
            console.error('Error fetching snacks:', error);
        } finally {
            set({ isFetchingSnacks: false });
        }
    },

    fetchSnackById: async (snackId: number) => {
        try {
            set({ isFetchingSnackDetails: true });

            const response = await _axios.get(`/v1/snack/get/${snackId}`);

            if (response.data) {
                set({ selectedSnack: response.data });
            }
        } catch (error) {
            console.error(`Error fetching snack with ID ${snackId}:`, error);
        } finally {
            set({ isFetchingSnackDetails: false });
        }
    },

    createSnack: async (snackData: Partial<Snack>) => {
        try {
            set({ isCreatingSnack: true });

            const response = await _axios.post('/v1/snack/create', snackData);

            if (response.data) {
                set((state) => ({ snacks: [...state.snacks, response.data] }));
            }
        } catch (error) {
            console.error('Error creating snack:', error);
        } finally {
            set({ isCreatingSnack: false });
        }
    },

    updateSnack: async (snackId: number, snackData: Partial<Snack>) => {
        try {
            set({ isUpdatingSnack: true });

            await _axios.put(`/v1/snack/update/${snackId}`, snackData);
            set((state) => ({
                snacks: state.snacks.map((snack) =>
                    snack.snack_id === snackId ? { ...snack, ...snackData } : snack
                ),
                selectedSnack:
                    state.selectedSnack?.snack_id === snackId
                        ? { ...state.selectedSnack, ...snackData }
                        : state.selectedSnack,
            }));
        } catch (error) {
            console.error(`Error updating snack with ID ${snackId}:`, error);
        } finally {
            set({ isUpdatingSnack: false });
        }
    },

    deleteSnack: async (snackId: number) => {
        try {
            set({ isDeletingSnack: true });

            await _axios.delete(`/v1/snack/delete/${snackId}`);
            set((state) => ({
                snacks: state.snacks.filter((snack) => snack.snack_id !== snackId),
            }));
        } catch (error) {
            console.error(`Error deleting snack with ID ${snackId}:`, error);
        } finally {
            set({ isDeletingSnack: false });
        }
    },

    clearSelectedSnack: () => {
        set({ selectedSnack: null });
    },
}));

import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

export interface Cinema {
    cinema_id: number;
    location_id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone_number: string;
    description?: string | null;
    image_overview?: string;
    location?: {
        location_id: number;
        city: string;
    } | null;
}

interface ApiCinema {
    cinema_id: number;
    location_id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone_number: string;
    description?: string | null;
    image_overview?: string;
    location?: {
        location_id: number;
        city: string;
    } | null;
    Location?: {
        location_id: number;
        city: string;
    } | null;
}

export const useCinemaStore = create<{
    cinemas: Cinema[];
    selectedCinema: Cinema | null;

    isFetchingCinemas: boolean;
    isFetchingCinemaDetails: boolean;
    isCreatingCinema: boolean;
    isUpdatingCinema: boolean;
    isDeletingCinema: boolean;

    fetchAllCinemas: () => Promise<void>;
    fetchCinemaById: (cinemaId: number) => Promise<void>;
    createCinema: (cinemaData: Partial<Cinema>) => Promise<void>;
    updateCinema: (cinemaId: number, cinemaData: Partial<Cinema>) => Promise<void>;
    deleteCinema: (cinemaId: number) => Promise<void>;
    clearSelectedCinema: () => void;
}>((set) => ({
    cinemas: [],
    selectedCinema: null,
    isFetchingCinemas: false,
    isFetchingCinemaDetails: false,
    isCreatingCinema: false,
    isUpdatingCinema: false,
    isDeletingCinema: false,

    fetchAllCinemas: async () => {
        const currentCinemas = useCinemaStore.getState().cinemas;
        // Skip if already fetched
        if (currentCinemas.length > 0) return;

        try {
            set({ isFetchingCinemas: true });

            const response = await _axios.get('/v1/cinema/get-all');

            if (response.data) {
                const mapped = (response.data as ApiCinema[]).map((item) => ({
                    ...item,
                    location: item.location ?? item.Location ?? null,
                }));

                set({ cinemas: mapped });
            }
        } catch (error) {
            console.error('Error fetching cinemas:', error);
        } finally {
            set({ isFetchingCinemas: false });
        }
    },

    fetchCinemaById: async (cinemaId: number) => {
        try {
            set({ isFetchingCinemaDetails: true });

            const response = await _axios.get(`/v1/cinema/get/${cinemaId}`);

            if (response.data) {
                const item = response.data as ApiCinema;
                set({
                    selectedCinema: {
                        ...item,
                        location: item.location ?? item.Location ?? null,
                    },
                });
            }
        } catch (error) {
            console.error(`Error fetching cinema with ID ${cinemaId}:`, error);
        } finally {
            set({ isFetchingCinemaDetails: false });
        }
    },

    createCinema: async (cinemaData: Partial<Cinema>) => {
        try {
            set({ isCreatingCinema: true });

            const response = await _axios.post('/v1/cinema/create', cinemaData);

            if (response.data) {
                set((state) => ({ cinemas: [...state.cinemas, response.data] }));
                addToast({
                    title: i18n.t('common.success'),
                    description: i18n.t('toasts.cinema.add_success'),
                    color: "success",
                    variant: "flat"
                });
            }
        } catch (error) {
            console.error('Error creating cinema:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.cinema.add_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isCreatingCinema: false });
        }
    },

    updateCinema: async (cinemaId: number, cinemaData: Partial<Cinema>) => {
        try {
            set({ isUpdatingCinema: true });

            await _axios.put(`/v1/cinema/update/${cinemaId}`, cinemaData);
            set((state) => ({
                cinemas: state.cinemas.map((cinema) =>
                    cinema.cinema_id === cinemaId ? { ...cinema, ...cinemaData } : cinema
                ),
                selectedCinema:
                    state.selectedCinema?.cinema_id === cinemaId
                        ? { ...state.selectedCinema, ...cinemaData }
                        : state.selectedCinema,
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.cinema.update_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error(`Error updating cinema with ID ${cinemaId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.cinema.update_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isUpdatingCinema: false });
        }
    },

    deleteCinema: async (cinemaId: number) => {
        try {
            set({ isDeletingCinema: true });

            await _axios.delete(`/v1/cinema/delete/${cinemaId}`);
            set((state) => ({
                cinemas: state.cinemas.filter((cinema) => cinema.cinema_id !== cinemaId),
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.cinema.delete_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error(`Error deleting cinema with ID ${cinemaId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.cinema.delete_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isDeletingCinema: false });
        }
    },

    clearSelectedCinema: () => {
        set({ selectedCinema: null });
    },
}));

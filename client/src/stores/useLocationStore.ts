import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

export interface Location {
    location_id: number;
    city: string;
}

export const useLocationStore = create<{
    locations: Location[];
    selectedLocation: Location | null;

    isFetchingLocations: boolean;
    isFetchingLocationDetails: boolean;
    isCreatingLocation: boolean;
    isUpdatingLocation: boolean;
    isDeletingLocation: boolean;

    fetchAllLocations: () => Promise<void>;
    fetchLocationById: (locationId: number) => Promise<void>;
    createLocation: (locationData: Partial<Location>) => Promise<void>;
    updateLocation: (locationId: number, locationData: Partial<Location>) => Promise<void>;
    deleteLocation: (locationId: number) => Promise<void>;
    clearSelectedLocation: () => void;
}>((set) => ({
    locations: [],
    selectedLocation: null,
    isFetchingLocations: false,
    isFetchingLocationDetails: false,
    isCreatingLocation: false,
    isUpdatingLocation: false,
    isDeletingLocation: false,

    fetchAllLocations: async () => {
        const currentLocations = useLocationStore.getState().locations;
        // Skip if already fetched
        if (currentLocations.length > 0) return;

        try {
            set({ isFetchingLocations: true });

            const response = await _axios.get('/v1/location/get-all');

            if (response.data) {
                set({ locations: response.data });
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            set({ isFetchingLocations: false });
        }
    },

    fetchLocationById: async (locationId: number) => {
        try {
            set({ isFetchingLocationDetails: true });

            const response = await _axios.get(`/v1/location/get/${locationId}`);

            if (response.data) {
                set({ selectedLocation: response.data });
            }
        } catch (error) {
            console.error(`Error fetching location with ID ${locationId}:`, error);
        } finally {
            set({ isFetchingLocationDetails: false });
        }
    },

    createLocation: async (locationData: Partial<Location>) => {
        try {
            set({ isCreatingLocation: true });

            const response = await _axios.post('/v1/location/create', locationData);

            if (response.data) {
                set((state) => ({ locations: [...state.locations, response.data] }));
                addToast({
                    title: i18n.t('common.success'),
                    description: i18n.t('toasts.location.add_success'),
                    color: "success",
                    variant: "flat"
                });
            }
        } catch (error) {
            console.error('Error creating location:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.location.add_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isCreatingLocation: false });
        }
    },

    updateLocation: async (locationId: number, locationData: Partial<Location>) => {
        try {
            set({ isUpdatingLocation: true });

            await _axios.put(`/v1/location/update/${locationId}`, locationData);
            set((state) => ({
                locations: state.locations.map((location) =>
                    location.location_id === locationId ? { ...location, ...locationData } : location
                ),
                selectedLocation:
                    state.selectedLocation?.location_id === locationId
                        ? { ...state.selectedLocation, ...locationData }
                        : state.selectedLocation,
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.location.update_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error(`Error updating location with ID ${locationId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.location.update_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isUpdatingLocation: false });
        }
    },

    deleteLocation: async (locationId: number) => {
        try {
            set({ isDeletingLocation: true });

            await _axios.delete(`/v1/location/delete/${locationId}`);
            set((state) => ({
                locations: state.locations.filter((location) => location.location_id !== locationId),
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.location.delete_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error(`Error deleting location with ID ${locationId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.location.delete_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isDeletingLocation: false });
        }
    },

    clearSelectedLocation: () => {
        set({ selectedLocation: null });
    },
}));

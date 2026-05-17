import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

export interface Room {
    room_id: number;
    cinema_id: number;
    nameRoom: string;
    roomLayoutType: 0 | 1 | 2 | 3; // Standard = 0, IMAX = 1, 4DX = 2, 3D = 3
    price: number;
    row: number;
    column: number;
    cinema?: {
        cinema_id: number;
        name: string;
    } | null;
}

interface ApiRoom {
    room_id: number;
    cinema_id: number;
    nameRoom: string;
    roomLayoutType: number | string;
    price: number;
    row: number;
    column: number;
    cinema?: {
        cinema_id: number;
        name: string;
    } | null;
    Cinema?: {
        cinema_id: number;
        name: string;
    } | null;
}

const mapRoomLayoutType = (value: number | string): 0 | 1 | 2 | 3 => {
    if (typeof value === 'number') {
        if (value === 1 || value === 2 || value === 3) return value;
        return 0;
    }

    const normalized = value.toLowerCase();
    if (normalized === 'imax') return 1;
    if (normalized === 'fourdx' || normalized === '4dx') return 2;
    if (normalized === 'threed' || normalized === '3d') return 3;
    return 0;
};

export const useRoomStore = create<{
    rooms: Room[];
    selectedRoom: Room | null;

    isFetchingRooms: boolean;
    isFetchingRoomDetails: boolean;
    isCreatingRoom: boolean;
    isUpdatingRoom: boolean;
    isDeletingRoom: boolean;

    fetchAllRooms: () => Promise<void>;
    fetchRoomById: (roomId: number) => Promise<void>;
    createRoom: (roomData: Partial<Room>) => Promise<void>;
    updateRoom: (roomId: number, roomData: Partial<Room>) => Promise<void>;
    deleteRoom: (roomId: number) => Promise<void>;
    clearSelectedRoom: () => void;
}>((set) => ({
    rooms: [],
    selectedRoom: null,
    isFetchingRooms: false,
    isFetchingRoomDetails: false,
    isCreatingRoom: false,
    isUpdatingRoom: false,
    isDeletingRoom: false,

    fetchAllRooms: async () => {
        const currentRooms = useRoomStore.getState().rooms;
        // Skip if already fetched
        if (currentRooms.length > 0) return;

        try {
            set({ isFetchingRooms: true });

            const response = await _axios.get('/v1/room/get-all');

            if (response.data) {
                const mapped = (response.data as ApiRoom[]).map((item) => ({
                    room_id: item.room_id,
                    cinema_id: item.cinema_id,
                    nameRoom: item.nameRoom,
                    roomLayoutType: mapRoomLayoutType(item.roomLayoutType),
                    price: item.price,
                    row: item.row,
                    column: item.column,
                    cinema: item.cinema ?? item.Cinema ?? null,
                }));

                set({ rooms: mapped });
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            set({ isFetchingRooms: false });
        }
    },

    fetchRoomById: async (roomId: number) => {
        try {
            set({ isFetchingRoomDetails: true });

            const response = await _axios.get(`/v1/room/get/${roomId}`);

            if (response.data) {
                const item = response.data as ApiRoom;
                set({
                    selectedRoom: {
                        room_id: item.room_id,
                        cinema_id: item.cinema_id,
                        nameRoom: item.nameRoom,
                        roomLayoutType: mapRoomLayoutType(item.roomLayoutType),
                        price: item.price,
                        row: item.row,
                        column: item.column,
                        cinema: item.cinema ?? item.Cinema ?? null,
                    },
                });
            }
        } catch (error) {
            console.error(`Error fetching room with ID ${roomId}:`, error);
        } finally {
            set({ isFetchingRoomDetails: false });
        }
    },

    createRoom: async (roomData: Partial<Room>) => {
        try {
            set({ isCreatingRoom: true });

            const response = await _axios.post('/v1/room/create', roomData);

            if (response.data) {
                set((state) => ({ rooms: [...state.rooms, response.data] }));
                addToast({
                    title: i18n.t('common.success'),
                    description: i18n.t('toasts.room.add_success'),
                    color: "success",
                    variant: "flat"
                });
            }
        } catch (error) {
            console.error('Error creating room:', error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.room.add_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isCreatingRoom: false });
        }
    },

    updateRoom: async (roomId: number, roomData: Partial<Room>) => {
        try {
            set({ isUpdatingRoom: true });

            await _axios.put(`/v1/room/update/${roomId}`, roomData);
            set((state) => ({
                rooms: state.rooms.map((room) =>
                    room.room_id === roomId ? { ...room, ...roomData } : room
                ),
                selectedRoom:
                    state.selectedRoom?.room_id === roomId
                        ? { ...state.selectedRoom, ...roomData }
                        : state.selectedRoom,
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.room.update_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error(`Error updating room with ID ${roomId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.room.update_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isUpdatingRoom: false });
        }
    },

    deleteRoom: async (roomId: number) => {
        try {
            set({ isDeletingRoom: true });

            await _axios.delete(`/v1/room/delete/${roomId}`);
            set((state) => ({
                rooms: state.rooms.filter((room) => room.room_id !== roomId),
            }));
            addToast({
                title: i18n.t('common.success'),
                description: i18n.t('toasts.room.delete_success'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error(`Error deleting room with ID ${roomId}:`, error);
            addToast({
                title: i18n.t('common.error'),
                description: i18n.t('toasts.room.delete_error'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isDeletingRoom: false });
        }
    },

    clearSelectedRoom: () => {
        set({ selectedRoom: null });
    },
}));

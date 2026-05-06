import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';

export interface Booking {
    booking_id: number;
    user_id: string;
    showtime_id: number;
    coupon_id?: number | null;
    totalAmount: number;
    discountAmount?: number | null;
    finalAmount: number;
    status: string;
    createAt: Date;
    userName?: string;
    cinemaName?: string;
}

interface ApiBooking {
    booking_id: number;
    user_id: string;
    showtime_id: number;
    coupon_id?: number | null;
    totalAmount: number;
    discountAmount?: number | null;
    finalAmount: number;
    status: string;
    createAt: Date;
    User?: {
        userName?: string;
    };
    ShowTime?: {
        Room?: {
            Cinema?: {
                name?: string;
            };
        };
    };
}

export const useBookingStore = create<{
    bookings: Booking[];
    selectedBooking: Booking | null;

    isFetchingBookings: boolean;
    isFetchingBookingDetails: boolean;
    isCreatingBooking: boolean;

    fetchAllBookings: () => Promise<void>;
    fetchBookingById: (bookingId: number) => Promise<void>;
    createBooking: (payload: { showtime_id: number; coupon_id?: number | null; snacks: { snack_id: number; quantity: number }[] }) => Promise<{
        booking_id: number;
        totalAmount: number;
        discountAmount?: number | null;
        finalAmount: number;
        status: string;
    } | null>;
    clearSelectedBooking: () => void;
}>((set) => ({
    bookings: [],
    selectedBooking: null,
    isCreatingBooking: false,
    isFetchingBookings: false,
    isFetchingBookingDetails: false,

    fetchAllBookings: async () => {
        const currentBookings = useBookingStore.getState().bookings;
        if (currentBookings.length > 0) return;

        try {
            set({ isFetchingBookings: true });

            const response = await _axios.get('/v1/booking/get-all');

            if (response.data) {
                const mapped = (response.data as ApiBooking[]).map((item) => ({
                    booking_id: item.booking_id,
                    user_id: item.user_id,
                    showtime_id: item.showtime_id,
                    coupon_id: item.coupon_id,
                    totalAmount: item.totalAmount,
                    discountAmount: item.discountAmount,
                    finalAmount: item.finalAmount,
                    status: item.status,
                    createAt: item.createAt,
                    userName: item.User?.userName ?? 'N/A',
                    cinemaName: item.ShowTime?.Room?.Cinema?.name ?? 'N/A',
                }));

                set({ bookings: mapped });
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            set({ isFetchingBookings: false });
        }
    },

    fetchBookingById: async (bookingId: number) => {
        try {
            set({ isFetchingBookingDetails: true });

            const response = await _axios.get(`/v1/booking/get/${bookingId}`);

            if (response.data) {
                const item = response.data as ApiBooking;
                set({
                    selectedBooking: {
                        booking_id: item.booking_id,
                        user_id: item.user_id,
                        showtime_id: item.showtime_id,
                        coupon_id: item.coupon_id,
                        totalAmount: item.totalAmount,
                        discountAmount: item.discountAmount,
                        finalAmount: item.finalAmount,
                        status: item.status,
                        createAt: item.createAt,
                        userName: item.User?.userName ?? 'N/A',
                        cinemaName: item.ShowTime?.Room?.Cinema?.name ?? 'N/A',
                    },
                });
            }
        } catch (error) {
            console.error(`Error fetching booking with ID ${bookingId}:`, error);
        } finally {
            set({ isFetchingBookingDetails: false });
        }
    },

    createBooking: async (payload: { showtime_id: number; coupon_id?: number | null; snacks: { snack_id: number; quantity: number }[] }) => {
        try {
            set({ isCreatingBooking: true });

            const authUser = useAuthStore.getState().authUser;
            const userId = authUser?.id ?? JSON.parse(localStorage.getItem('authUser') || 'null')?.id ?? '';

            const body = {
                user_id: userId,
                showtime_id: payload.showtime_id,
                coupon_id: payload.coupon_id ?? null,
                totalAmount: 0,
                discountAmount: 0,
                finalAmount: 0,
                snacks: payload.snacks,
            };

            const response = await _axios.post('/v1/booking/create', body);

            if (response.data) {
                return response.data as {
                    booking_id: number;
                    totalAmount: number;
                    discountAmount?: number | null;
                    finalAmount: number;
                    status: string;
                };
            }

            return null;
        } catch (error) {
            console.error('Error creating booking:', error);
            return null;
        } finally {
            set({ isCreatingBooking: false });
        }
    },

    clearSelectedBooking: () => {
        set({ selectedBooking: null });
    },
}));

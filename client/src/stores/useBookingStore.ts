import { create } from 'zustand';
import { _axios } from '@/lib/axios';

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

    fetchAllBookings: () => Promise<void>;
    fetchBookingById: (bookingId: number) => Promise<void>;
    clearSelectedBooking: () => void;
}>((set) => ({
    bookings: [],
    selectedBooking: null,
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

    clearSelectedBooking: () => {
        set({ selectedBooking: null });
    },
}));

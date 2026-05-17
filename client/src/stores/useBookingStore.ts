import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

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
    movieTitle?: string;
    posterPath?: string;
    startTime?: string;
    movie_id?: number;
    roomName?: string;
    seats?: string[];
    paymentMethod?: string;
    processedByUserName?: string;
    processedByAvatarPath?: string;
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
    Processor?: {
        userName?: string;
        avatar_path?: string;
    };
    ShowTime?: {
        Room?: {
            nameRoom?: string;
            Cinema?: {
                name?: string;
            };
        };
        Movie?: {
            title?: string;
            poster_path?: string;
        };
        startTime?: string;
        movie_id?: number;
    };
    ShowTimeSeats?: {
        Seat?: {
            seat_code?: string;
        };
    }[];
    VnpayPayments?: {
        method?: number;
    }[];
    MomoPayments?: {
        requestType?: string;
    }[];
}

export const useBookingStore = create<{
    bookings: Booking[];
    selectedBooking: Booking | null;

    isFetchingBookings: boolean;
    isFetchingBookingDetails: boolean;
    isCreatingBooking: boolean;

    fetchAllBookings: () => Promise<void>;
    fetchBookingById: (bookingId: number) => Promise<void>;
    createBooking: (payload: { 
        showtime_id: number; 
        coupon_id?: number | null; 
        snacks: { snack_id: number; quantity: number }[];
        seat_ids: number[]; // Backend expects integer IDs
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
    }) => Promise<{
        booking_id: number;
        totalAmount: number;
        discountAmount?: number | null;
        finalAmount: number;
        status: string;
    } | null>;
    cancelBooking: (bookingId: number) => Promise<boolean>;
    refundBooking: (bookingId: number) => Promise<boolean>;
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
                    roomName: item.ShowTime?.Room?.nameRoom ?? 'N/A',
                    movieTitle: item.ShowTime?.Movie?.title ?? 'N/A',
                    posterPath: item.ShowTime?.Movie?.poster_path ?? '',
                    startTime: item.ShowTime?.startTime ?? '',
                    movie_id: item.ShowTime?.movie_id,
                    seats: item.ShowTimeSeats?.map(d => d.Seat?.seat_code).filter(Boolean) as string[],
                    paymentMethod: item.VnpayPayments?.[0] ? 'VNPAY' : (item.MomoPayments?.[0] ? 'MOMO' : 'N/A'),
                    processedByUserName: item.Processor?.userName,
                    processedByAvatarPath: item.Processor?.avatar_path,
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
                        roomName: item.ShowTime?.Room?.nameRoom ?? 'N/A',
                        movieTitle: item.ShowTime?.Movie?.title ?? 'N/A',
                        posterPath: item.ShowTime?.Movie?.poster_path ?? '',
                        startTime: item.ShowTime?.startTime ?? '',
                        movie_id: item.ShowTime?.movie_id,
                        seats: item.ShowTimeSeats?.map(d => d.Seat?.seat_code).filter(Boolean) as string[],
                        paymentMethod: item.VnpayPayments?.[0] ? 'VNPAY' : (item.MomoPayments?.[0] ? 'MOMO' : 'N/A'),
                        processedByUserName: item.Processor?.userName,
                        processedByAvatarPath: item.Processor?.avatar_path,
                    },
                });
            }
        } catch (error) {
            console.error(`Error fetching booking with ID ${bookingId}:`, error);
        } finally {
            set({ isFetchingBookingDetails: false });
        }
    },

    createBooking: async (payload: { 
        showtime_id: number; 
        coupon_id?: number | null; 
        snacks: { snack_id: number; quantity: number }[];
        seat_ids: number[];
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
    }) => {
        try {
            set({ isCreatingBooking: true });

            const authUser = useAuthStore.getState().authUser;
            const userId = authUser?.id ?? JSON.parse(localStorage.getItem('authUser') || 'null')?.id ?? '';

            if (!userId) {
                console.error('Cannot create booking: User is not logged in');
                addToast({
                    title: i18n.t('toasts.booking.auth_required'),
                    description: i18n.t('toasts.booking.auth_required_desc'),
                    color: "danger",
                    variant: "flat"
                });
                return null;
            }

            const body = {
                user_id: userId,
                showtime_id: payload.showtime_id,
                coupon_id: payload.coupon_id ?? null,
                totalAmount: payload.totalAmount,
                discountAmount: payload.discountAmount,
                finalAmount: payload.finalAmount,
                snacks: payload.snacks,
                seat_ids: payload.seat_ids,
                status: 0, // Pending
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
            console.error('Error creating booking:', error instanceof Error ? error.message : 'Unknown error');
            addToast({
                title: i18n.t('toasts.booking.create_error'),
                description: i18n.t('toasts.booking.create_error_desc'),
                color: "danger",
                variant: "flat"
            });
            return null;
        } finally {
            set({ isCreatingBooking: false });
        }
    },

    cancelBooking: async (bookingId: number) => {
        try {
            const response = await _axios.post(`/v1/booking/cancel/${bookingId}`);
            if (response.status === 200) {
                set((state) => ({
                    bookings: state.bookings.map((b) => 
                        b.booking_id === bookingId ? { ...b, status: '2' } : b
                    )
                }));
                addToast({
                    title: i18n.t('toasts.booking.cancel_success'),
                    color: "success",
                    variant: "flat"
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return false;
        }
    },

    refundBooking: async (bookingId: number) => {
        try {
            const response = await _axios.post(`/v1/booking/refund/${bookingId}`);
            if (response.status === 200) {
                set((state) => ({
                    bookings: state.bookings.map((b) => 
                        b.booking_id === bookingId ? { ...b, status: '3' } : b
                    )
                }));
                addToast({
                    title: i18n.t('toasts.booking.refund_success'),
                    color: "success",
                    variant: "flat"
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refunding booking:', error);
            return false;
        }
    },

    clearSelectedBooking: () => {
        set({ selectedBooking: null });
    },
}));

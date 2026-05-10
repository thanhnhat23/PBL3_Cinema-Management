import { create } from 'zustand';
import { _axios } from '@/lib/axios';

export interface Coupon {
    coupon_id: number;
    code: string;
    description: string;
    type: 0 | 1; // Percentage = 0, FixedAmount = 1
    coupon_type: 0 | 1 | 2; // Limited = 0, Holiday = 1, Never = 2
    status: 0 | 1 | 2; // Active = 0, Expired = 1, Disabled = 2
    discountValue: number;
    maxDiscountAmount: number;
    minOrderValue: number;
    max_usage?: number | null;
    current_usage: number;
    startDate: string;
    endDate: string;
    isHoliday: boolean;
    applies_to?: string | null; // Ticket, Snack, Both
}

export const useCouponStore = create<{
    coupons: Coupon[];
    activeCoupons: Coupon[];
    selectedCoupon: Coupon | null;

    isFetchingCoupons: boolean;
    isFetchingActiveCoupons: boolean;
    isFetchingCouponDetails: boolean;
    isCreatingCoupon: boolean;
    isUpdatingCoupon: boolean;
    isDeletingCoupon: boolean;

    fetchAllCoupons: () => Promise<void>;
    fetchActiveCoupons: () => Promise<void>;
    fetchCouponById: (couponId: number) => Promise<void>;
    createCoupon: (couponData: Partial<Coupon>) => Promise<void>;
    updateCoupon: (couponId: number, couponData: Partial<Coupon>) => Promise<void>;
    deleteCoupon: (couponId: number) => Promise<void>;
    clearSelectedCoupon: () => void;
}>((set) => ({
    coupons: [],
    activeCoupons: [],
    selectedCoupon: null,
    isFetchingCoupons: false,
    isFetchingActiveCoupons: false,
    isFetchingCouponDetails: false,
    isCreatingCoupon: false,
    isUpdatingCoupon: false,
    isDeletingCoupon: false,

    fetchAllCoupons: async () => {
        try {
            set({ isFetchingCoupons: true });

            const response = await _axios.get('/v1/coupon/get-all');

            if (response.data) {
                set({ coupons: response.data });
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            set({ isFetchingCoupons: false });
        }
    },

    fetchActiveCoupons: async () => {
        try {
            set({ isFetchingActiveCoupons: true });

            const response = await _axios.get('/v1/coupon/active');

            if (response.data) {
                set({ activeCoupons: response.data });
            }
        } catch (error) {
            console.error('Error fetching active coupons:', error);
        } finally {
            set({ isFetchingActiveCoupons: false });
        }
    },

    fetchCouponById: async (couponId: number) => {
        try {
            set({ isFetchingCouponDetails: true });

            const response = await _axios.get(`/v1/coupon/get/${couponId}`);

            if (response.data) {
                set({ selectedCoupon: response.data });
            }
        } catch (error) {
            console.error(`Error fetching coupon with ID ${couponId}:`, error);
        } finally {
            set({ isFetchingCouponDetails: false });
        }
    },

    createCoupon: async (couponData: Partial<Coupon>) => {
        try {
            set({ isCreatingCoupon: true });

            const response = await _axios.post('/v1/coupon/create', couponData);

            if (response.data) {
                set((state) => ({ coupons: [...state.coupons, response.data] }));
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
        } finally {
            set({ isCreatingCoupon: false });
        }
    },

    updateCoupon: async (couponId: number, couponData: Partial<Coupon>) => {
        try {
            set({ isUpdatingCoupon: true });

            await _axios.put(`/v1/coupon/update/${couponId}`, couponData);
            set((state) => ({
                coupons: state.coupons.map((coupon) =>
                    coupon.coupon_id === couponId ? { ...coupon, ...couponData } : coupon
                ),
                selectedCoupon:
                    state.selectedCoupon?.coupon_id === couponId
                        ? { ...state.selectedCoupon, ...couponData }
                        : state.selectedCoupon,
            }));
        } catch (error) {
            console.error(`Error updating coupon with ID ${couponId}:`, error);
        } finally {
            set({ isUpdatingCoupon: false });
        }
    },

    deleteCoupon: async (couponId: number) => {
        try {
            set({ isDeletingCoupon: true });

            await _axios.delete(`/v1/coupon/delete/${couponId}`);
            set((state) => ({
                coupons: state.coupons.filter((coupon) => coupon.coupon_id !== couponId),
            }));
        } catch (error) {
            console.error(`Error deleting coupon with ID ${couponId}:`, error);
        } finally {
            set({ isDeletingCoupon: false });
        }
    },

    clearSelectedCoupon: () => {
        set({ selectedCoupon: null });
    },
}));

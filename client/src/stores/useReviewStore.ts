import { create } from "zustand";
import { isAxiosError } from "axios";
import { _axios } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { addToast } from "@heroui/toast";
import i18n from '@/lib/i18n';

export interface Review {
    review_id: string;
    movie_id: number;
    username: string;
    profile_slug: string;
    avatar_provider: string;
    avatar_path?: string | null;
    comment?: string;
    rating: number;
    isApproved: boolean;
    createAt: Date;
}

export const useReviewStore = create<{
    reviews: Review[]; // Reviews for the selected movie
    isFetchingReviews: boolean;
    isFetchingReviewId: boolean;
    isCreatingReview: boolean;
    isUpdatingReview: boolean;
    isBannedReview: boolean;

    fetchReviews: () => Promise<void>;
    fetchReviewId: (reviewId: string) => Promise<void>;
    fetchReviewByMovieId: (movieId: number) => Promise<void>;
    createReview: (movieId: number, comment: string, rating: number) => Promise<void>;
    updateReview: (reviewId: string, comment?: string, rating?: number) => Promise<void>;
    banReview: (reviewId: string) => Promise<void>;
    clearReviews: () => void;
}>((set) => ({
    reviews: [],
    isFetchingReviews: false,
    isFetchingReviewId: false,
    isCreatingReview: false,
    isUpdatingReview: false,
    isBannedReview: false,

    fetchReviews: async () => {
        const currentReviews = useReviewStore.getState().reviews;
        // Skip if already fetched
        if (currentReviews.length > 0) return;

        try {
            set({ isFetchingReviews: true });

            const response = await _axios.get(`/v1/review/get-all`);

            if (response.data) {
                set({ reviews: response.data });
            }

        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            set({ isFetchingReviews: false });
        }

    },

    fetchReviewId: async (reviewId: string) => {
        try {
            set({ isFetchingReviewId: true });

            const response = await _axios.get(`/v1/review/get/${reviewId}`);

            if (response.data) {
                set({ reviews: [response.data] });
            }

        } catch (error) {
            console.error(`Failed to fetch review with ID ${reviewId}:`, error);
        } finally {
            set({ isFetchingReviewId: false });
        }
    },

    fetchReviewByMovieId: async (movieId: number) => {
        try {
            set({ isFetchingReviewId: true });

            const response = await _axios.get(`/v1/review/get-reviews-by-movie/${movieId}`);

            if (response.data) {
                set({ reviews: response.data });
                return;
            }

            set({ reviews: [] });
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 404) {
                set({ reviews: [] });
                return;
            }

            console.error(`Failed to fetch review with movie ID ${movieId}:`, error);
            set({ reviews: [] });
        } finally {
            set({ isFetchingReviewId: false });
        }
    },

    createReview: async (movieId: number, comment: string, rating: number) => {
        try {
            set({ isCreatingReview: true });

            const authUser = useAuthStore.getState().authUser;
            if (!authUser?.id) {
                addToast({
                    title: i18n.t('toasts.review.auth_required'),
                    description: i18n.t('toasts.review.auth_required_desc'),
                    color: "danger",
                    variant: "flat"
                });
                return;
            }

            await _axios.post('/v1/review/create', {
                user_id: authUser.id,
                movie_id: movieId,
                content: comment,
                rating
            });

            addToast({
                title: i18n.t('toasts.review.add_success'),
                description: i18n.t('toasts.review.add_desc'),
                color: "success",
                variant: "flat"
            });

        } catch (error) {
            console.error("Failed to create review:", error);

            addToast({
                title: i18n.t('toasts.review.add_error'),
                description: i18n.t('toasts.review.add_error_desc'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isCreatingReview: false });
        }

    },

    updateReview: async (reviewId: string, comment?: string, rating?: number) => {
        try {
            set({ isUpdatingReview: true });

            await _axios.put(`/v1/review/update/${reviewId}`, {
                content: comment,
                rating
            });

            addToast({
                title: i18n.t('toasts.review.update_success'),
                description: i18n.t('toasts.review.update_desc'),
                color: "success",
                variant: "flat"
            });

        } catch (error) {
            console.error("Failed to update review:", error);
            
            addToast({
                title: i18n.t('toasts.review.update_error'),
                description: i18n.t('toasts.review.update_error_desc'),
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isUpdatingReview: false });
        }
    },

    banReview: async (reviewId: string) => {
        try {
            set({ isBannedReview: true });

            await _axios.put(`/v1/review/ban/${reviewId}`);

            addToast({
                title: i18n.t('toasts.review.ban_success'),
                description: i18n.t('toasts.review.ban_desc'),
                color: "success",
                variant: "flat"
            });
        } catch (error) {
            console.error("Failed to ban review:", error);

            addToast({
                title: i18n.t('toasts.review.ban_error'),
                description: i18n.t('toasts.review.ban_error_desc'), 
                color: "danger",
                variant: "flat"
            });
        } finally {
            set({ isBannedReview: false });
        }
    },

    clearReviews: () => set({ reviews: [] })
}));
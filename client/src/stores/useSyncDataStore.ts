import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';

const abortControllers: Record<string, AbortController | null> = {
    movie: null,
    status: null,
    review: null
};

export const useSyncDateStore = create<{
    isSyncingMovie: boolean;
    isSyncingStatusMovie: boolean;
    isSyncingReviewMovie: boolean;

    syncMovie: (status: string) => Promise<void>;
    syncStatusMovie: () => Promise<void>;
    syncReviewMovie: () => Promise<void>;
    stopSync: (type: 'movie' | 'status' | 'review') => void;
}>((set) => ({
    isSyncingMovie: false,
    isSyncingStatusMovie: false,
    isSyncingReviewMovie: false,

    stopSync: (type) => {
        if (abortControllers[type]) {
            abortControllers[type]?.abort();
            abortControllers[type] = null;
        }
    },

    syncMovie: async (status: string) => {
        set({ isSyncingMovie: true });
        abortControllers.movie = new AbortController();

        try {
            await _axios.post(`/v1/tmdb/sync-movies/${status}`, {}, {
                signal: abortControllers.movie.signal
            })

            addToast({ 
                title: 'Đồng bộ phim thành công!', 
                description: `Phim với trạng thái ${status} đã được đồng bộ thành công.`,
                color: 'success', 
                variant: 'flat'
            });
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'CanceledError') {
                addToast({
                    title: 'Đồng bộ phim đã bị hủy!',
                    description: `Đồng bộ phim với trạng thái ${status} đã bị hủy.`,
                    color: 'warning',
                    variant: 'flat'
                });
            } else {
                console.log('Error syncing movies:', error);
                addToast({ 
                    title: 'Đồng bộ phim thất bại!', 
                    description: `Đã xảy ra lỗi khi đồng bộ phim với trạng thái ${status}. Vui lòng thử lại sau.`,
                    color: 'danger', 
                    variant: 'flat'
                });
            }
        } finally {
            set({ isSyncingMovie: false });
        }
    },

    syncStatusMovie: async () => {
        set({ isSyncingStatusMovie: true });
        abortControllers.status = new AbortController(); 

        try {
            await _axios.post('/v1/tmdb/sync-update-status', {}, {
                signal: abortControllers.status.signal
            });

            addToast({ 
                title: 'Cập nhật trạng thái phim thành công!', 
                description: 'Trạng thái của các phim đã được cập nhật thành công.',
                color: 'success', 
                variant: 'flat'
            });
        } catch (error) {
            if (error instanceof Error && error.name === 'CanceledError') {
                addToast({
                    title: 'Cập nhật trạng thái phim đã bị hủy!',
                    description: 'Cập nhật trạng thái phim đã bị hủy.',
                    color: 'warning',
                    variant: 'flat'
                });
            } else {
                console.log('Error syncing movie statuses:', error);
                addToast({ 
                    title: 'Cập nhật trạng thái phim thất bại!', 
                    description: 'Đã xảy ra lỗi khi cập nhật trạng thái phim. Vui lòng thử lại sau.',
                    color: 'danger', 
                    variant: 'flat'
                });
            }
        } finally {
            set({ isSyncingStatusMovie: false });
        }
    },

    syncReviewMovie: async () => {
        set({ isSyncingReviewMovie: true });
        abortControllers.review = new AbortController();

        try {
            await _axios.post('/v1/tmdb/sync-reviews', {}, {
                signal: abortControllers.review.signal
            });

            addToast({ 
                title: 'Đồng bộ đánh giá phim thành công!', 
                description: 'Đánh giá của các phim đã được đồng bộ thành công.',
                color: 'success', 
                variant: 'flat'
            });
        } catch (error) {
            if (error instanceof Error && error.name === 'CanceledError') {
                addToast({
                    title: 'Đồng bộ đánh giá phim đã bị hủy!',
                    description: 'Đồng bộ đánh giá phim đã bị hủy.',
                    color: 'warning',
                    variant: 'flat'
                });
            } else {
                console.log('Error syncing movie reviews:', error);
                addToast({ 
                    title: 'Đồng bộ đánh giá phim thất bại!', 
                    description: 'Đã xảy ra lỗi khi đồng bộ đánh giá phim. Vui lòng thử lại sau.',
                    color: 'danger', 
                    variant: 'flat'
                });
            }
        } finally {
            set({ isSyncingReviewMovie: false });
        }
    }
}));
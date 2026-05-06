import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';

type MovieSyncStatus = 'upcoming' | 'nowplaying' | 'popular';

const abortControllers: Record<MovieSyncStatus | 'status' | 'review', AbortController | null> = {
    upcoming: null,
    nowplaying: null,
    popular: null,
    status: null,
    review: null
};

const movieStateKeyMap: Record<MovieSyncStatus, 'isSyncingUpcomingMovie' | 'isSyncingNowPlayingMovie' | 'isSyncingPopularMovie'> = {
    upcoming: 'isSyncingUpcomingMovie',
    nowplaying: 'isSyncingNowPlayingMovie',
    popular: 'isSyncingPopularMovie'
};

export const useSyncDateStore = create<{
    isSyncingUpcomingMovie: boolean;
    isSyncingNowPlayingMovie: boolean;
    isSyncingPopularMovie: boolean;
    isSyncingStatusMovie: boolean;
    isSyncingReviewMovie: boolean;

    syncMovie: (status: MovieSyncStatus) => Promise<void>;
    syncStatusMovie: () => Promise<void>;
    syncReviewMovie: () => Promise<void>;
    stopSync: (type: MovieSyncStatus | 'status' | 'review') => void;
}>((set) => ({
    isSyncingUpcomingMovie: false,
    isSyncingNowPlayingMovie: false,
    isSyncingPopularMovie: false,
    isSyncingStatusMovie: false,
    isSyncingReviewMovie: false,

    stopSync: (type) => {
        if (abortControllers[type]) {
            abortControllers[type]?.abort();
            abortControllers[type] = null;
        }
    },

    syncMovie: async (status: MovieSyncStatus) => {
        const stateKey = movieStateKeyMap[status];
        set({ [stateKey]: true } as Partial<{
            isSyncingUpcomingMovie: boolean;
            isSyncingNowPlayingMovie: boolean;
            isSyncingPopularMovie: boolean;
            isSyncingStatusMovie: boolean;
            isSyncingReviewMovie: boolean;
        }>);
        abortControllers[status] = new AbortController();

        try {
            await _axios.post(`/v1/tmdb/sync-movies/${status}`, {}, {
                signal: abortControllers[status]?.signal
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
            set({ [stateKey]: false } as Partial<{
                isSyncingUpcomingMovie: boolean;
                isSyncingNowPlayingMovie: boolean;
                isSyncingPopularMovie: boolean;
                isSyncingStatusMovie: boolean;
                isSyncingReviewMovie: boolean;
            }>);
            abortControllers[status] = null;
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
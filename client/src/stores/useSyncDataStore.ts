import { create } from 'zustand';
import { _axios } from '@/lib/axios';
import { addToast } from '@heroui/toast';
import i18n from '@/lib/i18n';

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
                title: i18n.t('toasts.sync.movie_success'), 
                description: i18n.t('toasts.sync.movie_desc', { status }),
                color: 'success', 
                variant: 'flat'
            });
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'CanceledError') {
                addToast({
                    title: i18n.t('toasts.sync.movie_cancelled'),
                    description: i18n.t('toasts.sync.movie_cancelled_desc', { status }),
                    color: 'warning',
                    variant: 'flat'
                });
            } else {
                console.log('Error syncing movies:', error);
                addToast({ 
                    title: i18n.t('toasts.sync.movie_error'), 
                    description: i18n.t('toasts.sync.movie_error_desc', { status }),
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
                title: i18n.t('toasts.sync.status_success'), 
                description: i18n.t('toasts.sync.status_desc'),
                color: 'success', 
                variant: 'flat'
            });
        } catch (error) {
            if (error instanceof Error && error.name === 'CanceledError') {
                addToast({
                    title: i18n.t('toasts.sync.status_cancelled'),
                    description: i18n.t('toasts.sync.status_cancelled_desc'),
                    color: 'warning',
                    variant: 'flat'
                });
            } else {
                console.log('Error syncing movie statuses:', error);
                addToast({ 
                    title: i18n.t('toasts.sync.status_error'), 
                    description: i18n.t('toasts.sync.status_error_desc'),
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
                title: i18n.t('toasts.sync.review_success'), 
                description: i18n.t('toasts.sync.review_desc'),
                color: 'success', 
                variant: 'flat'
            });
        } catch (error) {
            if (error instanceof Error && error.name === 'CanceledError') {
                addToast({
                    title: i18n.t('toasts.sync.review_cancelled'),
                    description: i18n.t('toasts.sync.review_cancelled_desc'),
                    color: 'warning',
                    variant: 'flat'
                });
            } else {
                console.log('Error syncing movie reviews:', error);
                addToast({ 
                    title: i18n.t('toasts.sync.review_error'), 
                    description: i18n.t('toasts.sync.review_error_desc'),
                    color: 'danger', 
                    variant: 'flat'
                });
            }
        } finally {
            set({ isSyncingReviewMovie: false });
        }
    }
}));
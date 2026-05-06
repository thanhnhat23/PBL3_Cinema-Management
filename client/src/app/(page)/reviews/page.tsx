'use client'

import { useEffect, useState, useMemo } from 'react'
import { useReviewStore } from '@/stores/useReviewStore'
import CardReview from '@/components/layout/cardReview';
import { useMovieStore } from '@/stores/useMovieStore';
import { Pagination } from "@heroui/react";
import CardReviewSkeleton from '@/components/skeletons/cardReview';
import { BlurFade } from "@/components/ui/effects/blur-fade";
import { useTranslation } from 'react-i18next';

export default function ReviewPage() {
    const { reviews, fetchReviews, isFetchingReviews } = useReviewStore();
    const { fetchAllMovies } = useMovieStore();
    const { t } = useTranslation();
    const [page, setPage] = useState<number>(1);

    const uniqueMovieReviews = useMemo(() => {
        const seenMovieIds = new Set<number>();
        return reviews.filter((review) => {
            if (seenMovieIds.has(review.movie_id)) return false;
            seenMovieIds.add(review.movie_id);
            return true;
        });
    }, [reviews]);

    const totalPage = Math.max(1, Math.ceil(uniqueMovieReviews.length / 15));

    const pagedReviews = useMemo(() => {
        const startIndex = (page - 1) * 15;
        return uniqueMovieReviews.slice(startIndex, startIndex + 15);
    }, [uniqueMovieReviews, page]);

    useEffect(() => {
        fetchReviews();
        fetchAllMovies();
    }, [fetchReviews, fetchAllMovies]);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Elegant Header Section */}
            <div className="w-full bg-sidebar py-14 mb-12 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-yellow-500/10 via-transparent to-amber-500/10" />
                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
                    <BlurFade delay={0.1}>
                        <div className="flex flex-col items-start gap-4">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                {t('reviews_page.audience_insights')}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white text-black uppercase drop-shadow-2xl">
                                {t('reviews_page.hero_title')} <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600">{t('reviews_page.hero_subtitle')}</span>
                            </h1>
                            <p className="text-zinc-500 font-medium max-w-2xl text-sm md:text-base leading-relaxed">
                                {t('reviews_page.hero_desc')}
                            </p>
                        </div>
                    </BlurFade>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {isFetchingReviews ? (
                    <div className="w-full flex flex-col gap-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CardReviewSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-6">
                        {pagedReviews.map((review, index) => (
                            <BlurFade key={review.review_id} delay={index * 0.05} inView>
                                <CardReview review={review} index={index} />
                            </BlurFade>
                        ))}
                    </div>
                )}

                {totalPage > 1 && (
                    <div className="flex justify-center mt-16">
                        <Pagination
                            page={page}
                            total={totalPage}
                            onChange={setPage}
                            classNames={{
                                wrapper: "gap-2",
                                item: "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold",
                                cursor: "bg-amber-500 text-white font-black"
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
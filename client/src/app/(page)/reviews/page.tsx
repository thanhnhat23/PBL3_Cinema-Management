'use client'

import { useEffect, useState, useMemo } from 'react'
import { useReviewStore } from '@/stores/useReviewStore'
import CardReview from '@/components/layout/cardReview';
import { useMovieStore } from '@/stores/useMovieStore';
import { Pagination } from "@heroui/react";
import CardReviewSkeleton from '@/components/skeletons/cardReview';

export default function ReviewPage() {
    const { reviews, fetchReviews, isFetchingReviews } = useReviewStore();
    const { fetchAllMovies } = useMovieStore();
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
        <div className='flex flex-col items-center p-4 md:p-8 md:w-[72%] mx-auto gap-4'>
            <div className="flex gap-2 w-full items-center justify-start mb-4">
                <span className="w-1 h-8 bg-black dark:bg-white"></span>
                <h1 className="text-2xl md:text-3xl font-bold">Đánh giá</h1>
            </div>

            {isFetchingReviews ? (
                <div className="min-h-screen w-full flex flex-col gap-4">
                    {Array.from({ length: 15 }).map((_, index) => (
                        <CardReviewSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className="w-full flex flex-col gap-4">
                    {pagedReviews.map((review, index) => (
                        <CardReview key={review.review_id} review={review} index={index} />
                    ))}
                </div>
            )}

            <Pagination
                page={page}
                total={totalPage}
                onChange={setPage}
                classNames={{
                    wrapper: "gap-2 mt-8 justify-center",
                    item: "bg-zinc-200 dark:bg-zinc-600"
                }}
            />
        </div>
    );
}
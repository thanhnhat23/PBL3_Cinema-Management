import { Card, CardBody, Divider } from "@heroui/react";
import { Review } from "@/stores/useReviewStore";
import { useMovieStore } from "@/stores/useMovieStore";
import Link from 'next/link';
import Image from 'next/image';
import { FaStar } from "react-icons/fa";

interface DataReviewProps {
  review: Review;
  index: number;
}

export default function CardReview ({ review, index }: DataReviewProps) {
    const { movies } = useMovieStore();
    const movie = movies.find((item) => item.movie_id === review.movie_id);

    return (
        <Card 
            as={Link}
            href={`/movies/${review.movie_id}`}
            key={index}
            radius="sm"
            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 transition-transform hover:scale-[1.01] duration-200 shadow-md"
        >
            <CardBody className="p-4 flex flex-row gap-4 items-start overflow-hidden">
                <div className="h-full min-w-36">
                    <Image 
                        src={movie?.poster_path ? `https://image.tmdb.org/t/p/original${movie?.poster_path}` : "/h.png"}
                        alt={movie?.title || 'Movie poster'}
                        width={150}
                        height={150}
                        className="object-cover w-36 h-56 rounded-sm shadow-lg"
                    />
                </div>

                <div className="flex flex-col gap-2 w-full min-h-46 whitespace-pre-line truncate">
                    
                    <p className="font-semibold md:text-lg text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-bold text-yellow-500 dark:text-yellow-300">[Review]</span> {" "}
                        {movie?.title}
                    </p>

                    <div className="flex md:flex-row flex-col gap-2">
                        <p className="md:text-sm text-xs text-gray-600 dark:text-gray-400">
                            Đánh giá bởi <span className="font-medium">{review.username}</span>
                        </p>

                        <span className="hidden md:block w-px md:h-5 bg-black dark:bg-gray-500/20"></span>

                        <p className="md:text-sm text-xs text-gray-600 dark:text-gray-400">
                            {review.createAt ? new Date(review.createAt).toLocaleDateString() : "Ngày không xác định"}
                        </p>
                    </div>

                    <Divider orientation="horizontal" className="bg-neutral-200 dark:bg-neutral-800" />

                    <p className="text-gray-800 dark:text-gray-200 line-clamp-4 md:text-base text-xs">
                        {review.comment || "Không có nội dung đánh giá."}
                    </p>

                    <Divider orientation="horizontal" className="bg-neutral-200 dark:bg-neutral-800" />

                    <div className="flex gap-1">
                        <span className="font-medium md:block hidden">Đánh giá:</span> {" "}
                        <span className="text-yellow-500 dark:text-yellow-300 md:flex items-center gap-1 hidden">
                            {Array(Math.round(review.rating)).fill(0).map((_, i) => (
                                <FaStar key={i} className="text-yellow-400" size={16} />
                            ))}
                        </span>

                        <p className="block md:hidden font-semibold text-sm">
                            Rating: {" "}
                            <span className="font-bold text-yellow-500 dark:text-yellow-300">
                                {review.rating}
                            </span>
                            {" "}/ 10{" "}
                            <span className="font-bold text-yellow-500 dark:text-yellow-300">
                                ★
                            </span>
                        </p>

                        <span className="text-gray-500 dark:text-gray-400 md:block hidden">
                            ({review.rating}/10)
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
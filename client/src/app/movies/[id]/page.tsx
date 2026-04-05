'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMovieStore } from "@/stores/useMovieStore";
import { useReviewStore } from "@/stores/useReviewStore";
import { Divider } from "@heroui/react";
import { Clock, Calendar } from 'lucide-react';
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { SparklesText } from "@/components/ui/texts/sparkles-text";
import { AvatarElement } from "@/components/ui/avatar";

export default function MoviePage() {
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

    const { 
        fetchMovieById,
        fetchActorWithMovies,
        clearSelectedMovie,
        clearActorWithMovies,
        selectedMovie,
        actorWithMovies 
    } = useMovieStore();

    const { fetchReviewByMovieId, clearReviews, reviews } = useReviewStore();

    const params = useParams();
    const movieId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

    const router = useRouter();

    const releaseDate = selectedMovie?.release_date ? new Date(selectedMovie.release_date) : null;
    const OneDayLeftCurrentNow = releaseDate
        ? releaseDate.getTime() - new Date().getTime() <= 1 * 24 * 60 * 60 * 1000
        : false;

    useEffect(() => {
        fetchMovieById(movieId);
        fetchActorWithMovies(movieId);
        fetchReviewByMovieId(movieId);

        return () => {
            clearSelectedMovie();
            clearActorWithMovies();
            clearReviews();
        };
    }, [fetchMovieById, fetchActorWithMovies, fetchReviewByMovieId, clearSelectedMovie, clearActorWithMovies, clearReviews, movieId]);

    const sortedActors = [...actorWithMovies].sort((a, b) => a.order - b.order);

    const toggleReviewExpand = (reviewId: string) => {
        const newExpanded = new Set(expandedReviews);
        if (newExpanded.has(reviewId)) {
            newExpanded.delete(reviewId);
        } else {
            newExpanded.add(reviewId);
        }
        setExpandedReviews(newExpanded);
    }

    return (
        <div className="min-h-screen flex flex-col item-center md:w-[85%] w-full mx-auto">
            <div className="relative">
                <Image
                    src={`https://image.tmdb.org/t/p/original${selectedMovie?.backdrop_path}`}
                    alt="Backdrop"
                    width={2500}
                    height={600}
                    className="object-fill w-full md:h-140 h-52 object-center md:mask-x-from-94% md:mask-b-to-99% mask-x-from-98%"
                />
            </div>

            <div className="flex gap-2 md:px-56 md:-mt-32 px-4 -mt-12 z-10">
                <Image 
                    src={`https://image.tmdb.org/t/p/original${selectedMovie?.poster_path}`}
                    alt="Poster"
                    width={600}
                    height={600}
                    className="object-fill w-36 h-56 md:w-64 md:h-96 object-center rounded-lg border-4 border-neutral-800"
                />

                <div className="flex flex-col md:py-40 md:px-10 py-14 px-2 whitespace-pre-line gap-4">
                    <div className="flex md:items-center items-end justify-start md:gap-4 font-semibold md:text-2xl text-md text-gray-700 dark:text-gray-100">
                        {selectedMovie?.title} {" "}

                        <span className={`px-2 py-1 w-8 h-8 flex items-center justify-center rounded-md ${selectedMovie?.adult ? "bg-red-500" : "bg-orange-400"}`}>
                            <p className="text-xs md:text-md font-bold text-white text-center">{selectedMovie?.adult ? "T18" : "T16"}</p>
                        </span>
                    </div>

                    <Divider orientation="horizontal"/>

                    <div className="flex md:gap-4 gap-2 items-center justify-start">
                        <div className="flex gap-2 items-center justify-center">
                            <Clock className="text-gray-700 dark:text-gray-400" size={16}/>
                            <p className="text-sm md:text-md text-gray-700 dark:text-gray-400 flex gap-2">
                                <span className="md:block hidden">Thời lượng: </span>
                                {selectedMovie?.runtime} phút
                            </p>
                        </div>

                        <Divider orientation="vertical"/>

                        <div className="flex gap-2 items-center justify-center">
                            <Calendar className="text-gray-700 dark:text-gray-400" size={16}/>
                            <p className="text-sm md:text-md text-gray-700 dark:text-gray-400 flex gap-2">
                                <span className="md:block hidden">Ngày chiếu: </span>
                                {selectedMovie?.release_date ? new Date(selectedMovie.release_date).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-start gap-2">
                        <FaStar className="text-yellow-400" size={28}/>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-300">
                            {selectedMovie?.vote_average?.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-400">
                            <span className="text-sm text-gray-700 dark:text-gray-400">({selectedMovie?.vote_count} lượt đánh giá)</span>
                        </p>
                    </div>

                    {/* Movie with actor for desktop view */}
                    <div className="md:flex hidden gap-2 items-center justify-start mt-2">
                        {sortedActors.map((actorWithMovie, index) => (
                            <Link 
                                href={`/actors/${actorWithMovie?.Actor?.actor_id}`}
                                key={index} 
                                className="w-14 h-14 scroll-smooth"
                            >
                                <Image
                                    src={actorWithMovie.Actor.profile_path ? `https://image.tmdb.org/t/p/original${actorWithMovie.Actor.profile_path}` : "https://i.pinimg.com/originals/07/d1/7b/07d17b28a3aa58087b0dc151c18bf7b6.gif"}
                                    alt={actorWithMovie.Actor.name}
                                    width={72}
                                    height={72}
                                    className="object-cover w-full h-full rounded-full border-2 border-neutral-800 hover:border-fuchsia-400 duration-150"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Movie with actor for mobile view */}
            <div className="flex flex-wrap md:hidden gap-2 items-center justify-center mb-4 px-2">
                {sortedActors.map((actorWithMovie, index) => (
                    <Link 
                        href={`/actors/${actorWithMovie?.Actor?.actor_id}`}
                        key={index} 
                        className="w-12 h-12"
                    >
                        <Image
                            src={actorWithMovie.Actor.profile_path ? `https://image.tmdb.org/t/p/original${actorWithMovie.Actor.profile_path}` : "https://i.pinimg.com/originals/07/d1/7b/07d17b28a3aa58087b0dc151c18bf7b6.gif"}
                            alt={actorWithMovie.Actor.name}
                            width={72}
                            height={72}
                            className="object-cover w-full h-full rounded-full border-2 border-neutral-800 hover:border-fuchsia-400 duration-150"
                        />
                    </Link>
                ))}
            </div>

            <div className="w-full md:px-56 px-4 py-6 md:-mt-24 z-10">
                <button
                    disabled={selectedMovie?.status !== 0 && selectedMovie?.status !== 1}
                    className={`w-full px-6 py-2 rounded flex items-center justify-center gap-2 font-semibold ${
                        selectedMovie?.status === 0 || (selectedMovie?.status === 1 && OneDayLeftCurrentNow)
                            ? "bg-orange-400 text-yellow-100 cursor-pointer"
                            : "bg-zinc-400 text-zinc-100 cursor-not-allowed"
                    }`}
                    onClick={() => {
                        if (selectedMovie?.status === 0 || (selectedMovie?.status === 1 && OneDayLeftCurrentNow)) {
                            router.push('/');
                        }
                    }}
                >
                    <FaStar size={18} />
                    Đặt vé
                </button>
            </div>

            <div className="w-full md:px-56 px-4 mt-4 cursor-default">
                <div className="flex gap-2 w-full items-center justify-start mb-4">
                    <span className="w-1 h-5 md:h-8 bg-black dark:bg-white"></span>
                    <h1 className="text-xl md:text-3xl font-bold">Nội dung phim</h1>
                </div>
                
                <p className="md:text-lg/6 whitespace-pre-wrap tracking-wide text-sm/6">
                    {selectedMovie?.overview || "Hiện chưa có tiểu sử cho phim này. Chúng tôi sẽ cập nhật sớm nhất có thể."}
                </p>
            </div>

            <div className="w-full md:px-56 px-4 mt-12 cursor-default">
                <div className="flex gap-2 w-full items-center justify-start mb-4">
                    <span className="w-1 h-5 md:h-8 bg-black dark:bg-white"></span>
                    <h1 className="text-xl md:text-3xl font-bold">Trailer</h1>
                </div>
                
                <div className="w-full aspect-video">
                    {selectedMovie?.trailer_url ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedMovie.trailer_url}?autoplay=1&mute=0&playsinline=1&rel=0`}
                            title="YouTube video player"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            loading="lazy"
                            className="w-full h-full rounded-sm border-2 border-neutral-800"
                        >
                        </iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[url(https://i.pinimg.com/736x/47/6d/1f/476d1f93226290a680ae3e281ae408bd.jpg)] bg-cover bg-center rounded">
                            <SparklesText className="text-neutral-800 text-2xl md:text-6xl">
                                Trailer chưa có sẵn
                            </SparklesText> 
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full md:px-56 px-4 my-12 cursor-default">
                <div className="flex gap-2 w-full items-center justify-start mb-4">
                    <span className="w-1 h-5 md:h-8 bg-black dark:bg-white"></span>
                    <h1 className="text-xl md:text-3xl font-bold">Đánh giá</h1>
                </div>
                
                {reviews && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-neutral-800">
                            <div className="flex items-center justify-between mb-2 ">
                                <div className="flex items-center gap-4">
                                    <AvatarElement avatar={review?.avatar_path} width="w-12" height="h-12" widthDeco="w-15" translatex="-translate-x-1.5"/>

                                    <div className="flex flex-col">
                                        <p className="font-bold text-gray-800 dark:text-gray-300">{review.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(review?.createAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1">
                                        {Array(Math.round(review.rating)).fill(0).map((_, i) => (
                                            <FaStar key={i} className="text-yellow-400" size={14} />
                                        ))}
                                        <p className="text-sm text-gray-600 dark:text-gray-400 md:block hidden">
                                            ({review.rating.toFixed(1)} / 10)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className={`text-gray-700 dark:text-gray-400 whitespace-pre-line text-sm md:text-lg ${expandedReviews.has(review.review_id) ? '' : 'line-clamp-2'}`}>
                                {review.comment}
                            </p>

                            <button 
                                className="mt-2 text-sm text-blue-500 hover:underline cursor-pointer" 
                                onClick={() => toggleReviewExpand(review.review_id)}
                            >
                                {expandedReviews.has(review.review_id) ? 'Ẩn bớt' : 'Xem thêm'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="w-full h-16 flex items-center justify-center mb-6 p-4 border rounded-md bg-gray-50 dark:bg-neutral-800">
                        <p className="text-gray-500 dark:text-gray-400">Chưa có đánh giá nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}
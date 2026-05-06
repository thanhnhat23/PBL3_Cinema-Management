'use client';

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMovieStore } from "@/stores/useMovieStore";
import { useReviewStore } from "@/stores/useReviewStore";
import { Divider, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure } from "@heroui/react";
import { Clock, Calendar, ChevronRight, X } from 'lucide-react';
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { SparklesText } from "@/components/ui/texts/sparkles-text";
import { AvatarElement } from "@/components/ui/avatar";
import DetailPageSkeleton from "@/components/skeletons/detailPage";
import { BlurFade } from "@/components/ui/effects/blur-fade";
import UserReviewItem from "@/components/layout/userReviewItem";
import { useTranslation } from "react-i18next";

export default function MoviePage() {
    const { 
        fetchMovieById,
        fetchActorWithMovies,
        clearSelectedMovie,
        clearActorWithMovies,
        selectedMovie,
        actorWithMovies,
        isFetchingMovieDetails
    } = useMovieStore();

    const { fetchReviewByMovieId, clearReviews, reviews } = useReviewStore();
    const { isOpen: isActorsOpen, onOpen: onActorsOpen, onOpenChange: onActorsOpenChange } = useDisclosure();
    const { isOpen: isReviewsOpen, onOpen: onReviewsOpen, onOpenChange: onReviewsOpenChange } = useDisclosure();
    const { t } = useTranslation();

    const params = useParams();
    const movieId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

    const router = useRouter();

    const [backdropSrc, setBackdropSrc] = useState<string>("");
    const [posterSrc, setPosterSrc] = useState<string>("");

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

    useEffect(() => {
        if (selectedMovie) {
            setBackdropSrc(`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`);
            setPosterSrc(`https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`);
        }
    }, [selectedMovie]);

    const sortedActors = useMemo(() => [...actorWithMovies].sort((a, b) => a.order - b.order), [actorWithMovies]);

    if (isFetchingMovieDetails || !selectedMovie) {
        return <DetailPageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Cinematic Immersive Backdrop */}
            <div className="relative w-full h-[70vh] md:h-[75vh] overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-background/60 via-transparent to-background/60 dark:from-background/80 dark:to-background/80" />
                <Image 
                    src={backdropSrc || "/h.png"}
                    alt="Movie Backdrop"
                    fill
                    priority
                    unoptimized={!selectedMovie?.backdrop_path}
                    className="object-cover object-center scale-105 blur-[2px] opacity-60"
                />
                
                {/* Floating Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 md:px-0 md:w-[85%] mx-auto pb-12 md:pb-24 pt-32">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        {/* High-End Poster */}
                        <BlurFade delay={0.1}>
                            <div className="relative group mx-auto md:mx-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <Image 
                                    src={posterSrc || "/h.png"}
                                    alt="Poster"
                                    width={320}
                                    height={480}
                                    onError={() => setPosterSrc("/h.png")}
                                    className="relative object-cover rounded-sm border border-white/10 shadow-2xl w-[180px] md:w-[320px] h-auto"
                                />
                            </div>
                        </BlurFade>

                        <div className="flex-1 flex flex-col gap-6">
                            <BlurFade delay={0.2}>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black text-sidebar uppercase tracking-widest ${selectedMovie?.adult ? "bg-rose-600" : "bg-amber-500"}`}>
                                        {selectedMovie?.adult ? "T18+" : "T16+"}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/10 backdrop-blur-md border border-zinc-200 dark:border-white/20 text-[10px] font-black text-zinc-500 dark:text-white/80 uppercase tracking-widest">
                                        {t('movie_detail.movie_detail_label')}
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase drop-shadow-2xl text-center md:text-left">
                                    {selectedMovie?.title}
                                </h1>
                            </BlurFade>

                            <BlurFade delay={0.3}>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-zinc-600 dark:text-white/80 font-bold uppercase text-[10px] md:text-xs tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-amber-500" />
                                        <span>{selectedMovie?.runtime} {t('movie_detail.runtime')}</span>
                                    </div>
                                    <div className="md:w-1.5 md:h-1.5 w-1 h-1 rounded-full bg-zinc-200 dark:bg-white/20" />
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-amber-500" />
                                        <span>{selectedMovie?.release_date ? new Date(selectedMovie.release_date).getFullYear() : "N/A"}</span>
                                    </div>
                                    <div className="md:w-1.5 md:h-1.5 w-1 h-1 rounded-full bg-zinc-200 dark:bg-white/20" />
                                    <div className="flex items-center gap-2">
                                        <FaStar size={16} className="text-yellow-400" />
                                        <span className="text-zinc-900 dark:text-white text-xs md:text-sm font-black">{selectedMovie?.vote_average?.toFixed(1)}</span>
                                        <span className="text-zinc-400 dark:text-white/40 font-medium text-[9px] md:text-xs">({selectedMovie?.vote_count} {t('movie_detail.reviews_count')})</span>
                                    </div>
                                </div>
                            </BlurFade>

                            <BlurFade delay={0.4}>                                
                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <button
                                        disabled={selectedMovie?.status !== 0 && selectedMovie?.status !== 1}
                                        className={`px-8 md:px-10 py-3 md:py-4 rounded-full flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all shadow-2xl ${
                                            selectedMovie?.status === 0 || (selectedMovie?.status === 1 && OneDayLeftCurrentNow)
                                                ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white cursor-pointer hover:scale-105 hover:shadow-orange-500/40 active:scale-95 shadow-xl"
                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                        }`}
                                        onClick={() => {
                                            if (selectedMovie?.status === 0 || (selectedMovie?.status === 1 && OneDayLeftCurrentNow)) {
                                                router.push('/booking/' + selectedMovie.movie_id);
                                            }
                                        }}
                                    >
                                        <div className="bg-zinc-100/50 dark:bg-white/20 p-1 rounded-full"><FaStar size={14} /></div>
                                        {t('movie_detail.book_now')}
                                    </button>
                                    
                                    {selectedMovie?.trailer_url && (
                                        <button 
                                            className="px-8 md:px-10 py-3 md:py-4 rounded-full border-2 border-zinc-200 dark:border-white/20 bg-white dark:bg-white/5 backdrop-blur-md text-zinc-900 dark:text-white font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/40 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                                            onClick={() => {
                                                const trailerSection = document.getElementById('trailer-section');
                                                trailerSection?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            <div className="bg-zinc-100 dark:bg-white/10 p-1 rounded-full"><Clock size={14} /></div>
                                            {t('movie_detail.watch_trailer')}
                                        </button>
                                    )}
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="md:w-[85%] mx-auto px-4 md:px-0 md:-mt-10 mt-6 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Column: Info & Trailer */}
                    <div className="lg:col-span-2 flex flex-col gap-8 md:gap-12">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
                                <h2 className="text-2xl font-black uppercase tracking-tight">{t('movie_detail.storyline')}</h2>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                                {selectedMovie?.overview || t('movie_detail.no_overview')}
                            </p>
                        </div>

                        {/* Trailer Section */}
                        <div id="trailer-section" className="bg-white dark:bg-zinc-900 rounded-sm overflow-hidden shadow-2xl border border-zinc-100 dark:border-white/5">
                             <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 md:h-8 bg-amber-500 rounded-full" />
                                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">{t('movie_detail.official_trailer')}</h2>
                                </div>
                             </div>
                             <div className="aspect-video w-full">
                                {selectedMovie?.trailer_url ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${selectedMovie.trailer_url}?rel=0`}
                                        title="YouTube video player"
                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-sidebar gap-4">
                                        <SparklesText className="text-zinc-800 text-4xl font-black">{t('movie_detail.coming_soon')}</SparklesText>
                                        <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">{t('movie_detail.trailer_not_ready')}</p>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Cast & Reviews Summary */}
                    <div className="flex flex-col gap-8">
                        {/* Cast Section */}
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 md:h-8 bg-amber-500 rounded-full" />
                                <h2 className="text-xl font-black uppercase tracking-tight">{t('movie_detail.main_cast')}</h2>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {sortedActors.slice(0, 6).map((actor, index) => (
                                    <Link 
                                        href={`/actors/${actor?.Actor?.actor_id}`}
                                        key={index}
                                        className="group flex flex-col items-center gap-2"
                                    >
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-amber-500 transition-all duration-300">
                                            <Image
                                                src={actor.Actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.Actor.profile_path}` : "https://i.pinimg.com/originals/07/d1/7b/07d17b28a3aa58087b0dc151c18bf7b6.gif"}
                                                alt={actor.Actor.name}
                                                fill
                                                unoptimized={!actor.Actor.profile_path}
                                                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black text-center uppercase tracking-tighter group-hover:text-amber-500 transition-colors">
                                                    {actor.Actor.name}
                                                </span>
                                                <span className="text-[8px] text-zinc-500 font-bold text-center italic truncate w-full">
                                                    {actor.char_name}
                                                </span>
                                            </div>
                                    </Link>
                                ))}
                            </div>
                            <button 
                                onClick={onActorsOpen}
                                className="w-full mt-8 flex items-center justify-center py-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
                            >
                                {t('movie_detail.view_all_cast')}
                            </button>
                        </div>

                        {/* Reviews Highlight */}
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                             <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 md:h-8 bg-amber-500 rounded-full" />
                                <h2 className="text-xl font-black uppercase tracking-tight">{t('movie_detail.new_reviews')}</h2>
                            </div>
                            {reviews && reviews.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {reviews.slice(0, 2).map((review, i) => (
                                        <div key={i} className="flex flex-col gap-3 pb-6 border-b border-zinc-100 dark:border-zinc-800 last:border-none last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <AvatarElement avatar={review?.avatar_path} width="w-8" height="h-8" widthDeco="w-10" translatex="-translate-x-1"/>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase">{review.username}</span>
                                                    <div className="flex items-center gap-1">
                                                        <FaStar className="text-yellow-400" size={10} />
                                                        <span className="text-[10px] font-bold">{review.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 italic line-clamp-2 leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={onReviewsOpen}
                                        className="w-full flex items-center justify-center py-3 rounded-sm border border-dashed border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                                    >
                                        {t('movie_detail.view_all_reviews', { count: reviews.length })}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-400 italic text-sm font-medium">{t('movie_detail.no_reviews')}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actors Drawer */}
            <Drawer 
                isOpen={isActorsOpen} 
                onOpenChange={onActorsOpenChange} 
                size="md"
                classNames={{
                    base: "bg-white dark:bg-zinc-950/95 backdrop-blur-2xl border-l border-zinc-200 dark:border-white/5",
                    header: "border-b border-zinc-100 dark:border-white/5 px-8 py-6",
                    body: "px-8 py-8",
                    footer: "border-t border-zinc-100 dark:border-white/5 px-8 py-6"
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">{t('movie_detail.cast_list')}</h2>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t('movie_detail.all_cast_for', { title: selectedMovie.title })}</p>
                                </div>
                            </DrawerHeader>
                            <DrawerBody>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {sortedActors.map((actor, index) => (
                                        <Link 
                                            href={`/actors/${actor?.Actor?.actor_id}`}
                                            key={index}
                                            className="group flex flex-col items-center gap-3 p-4 rounded-sm bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300"
                                            onClick={onClose}
                                        >
                                            <div className="relative w-24 h-24 rounded-sm overflow-hidden border-2 border-transparent group-hover:border-amber-500 transition-all duration-500">
                                                <Image
                                                    src={actor.Actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.Actor.profile_path}` : "https://i.pinimg.com/originals/07/d1/7b/07d17b28a3aa58087b0dc151c18bf7b6.gif"}
                                                    alt={actor.Actor.name}
                                                    fill
                                                    unoptimized={!actor.Actor.profile_path}
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[10px] font-black text-center uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                                    {actor.Actor.name}
                                                </span>
                                                <span className="text-[9px] text-zinc-500 font-bold text-center italic leading-tight">
                                                    {actor.char_name}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </DrawerBody>
                            <DrawerFooter>
                                <button 
                                    onClick={onClose}
                                    className="w-full py-4 rounded-sm bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    {t('movie_detail.close_list')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Reviews Drawer */}
            <Drawer 
                isOpen={isReviewsOpen} 
                onOpenChange={onReviewsOpenChange} 
                size="xl"
                classNames={{
                    base: "bg-white dark:bg-zinc-950/95 backdrop-blur-2xl border-l border-zinc-200 dark:border-white/5",
                    header: "border-b border-zinc-100 dark:border-white/5 px-8 py-6",
                    body: "px-8 py-8",
                    footer: "border-t border-zinc-100 dark:border-white/5 px-8 py-6"
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">{t('movie_detail.all_reviews')}</h2>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t('movie_detail.community_reviews', { count: reviews.length })}</p>
                                </div>
                            </DrawerHeader>
                            <DrawerBody>
                                <div className="flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
                                    {reviews.map((review, i) => (
                                        <UserReviewItem key={i} review={review} index={i} />
                                    ))}
                                </div>
                            </DrawerBody>
                            <DrawerFooter>
                                <button 
                                    onClick={onClose}
                                    className="w-full py-4 rounded-sm bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    {t('movie_detail.back')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
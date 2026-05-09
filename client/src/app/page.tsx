"use client";

import { CardMovie } from "@/components/layout/cardMovie";
import dynamic from "next/dynamic";
import {
    ChevronRight,
} from "../components/icons/chevron-right";
import { Film } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Tab, Tabs, Image, Card, CardBody, CardFooter } from "@heroui/react";
import { Cctv } from "../components/icons/cctv";
import { TrendingUpIcon } from "../components/icons/trending-up";
import { FlameIcon, type FlameIconHandle } from "../components/icons/flame";
import { useMovieStore } from "@/stores/useMovieStore";
import CardSkeleton from "@/components/skeletons/cardMovie";
import { Meteors } from "@/components/ui/effects/meteors";
import { Iphone } from "@/components/ui/iphone";
import { SparklesText } from "@/components/ui/texts/sparkles-text";
import { AuroraText } from "@/components/ui/texts/aurora-text";
import { _axios } from "@/lib/axios";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDialogStore } from "@/stores/useDialogStore";

const Carousel = dynamic(() => import("@/components/layout/carousel"), {
    ssr: true,
});

export default function HomePage() {
    return (
        <Suspense>
            <Home />
        </Suspense>
    );
}

function Home() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>('now-playing');
    const flameRef = useRef<FlameIconHandle | null>(null);
    const trendingRef = useRef<FlameIconHandle | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchMoviesByStatus = useMovieStore(state => state.fetchMoviesByStatus);
    const fetchPopularMovies = useMovieStore(state => state.fetchPopularMovies);
    const moviesByStatusMap = useMovieStore(state => state.moviesByStatusMap);
    const popularMovies = useMovieStore(state => state.popularMovies);
    const isFetchingMoviesByStatus = useMovieStore(state => state.isFetchingMoviesByStatus);
    const isFetchingPopularMovies = useMovieStore(state => state.isFetchingPopularMovies);
    const { t } = useTranslation();
    const authUser = useAuthStore(state => state.authUser);
    const setOpenDialog = useDialogStore(state => state.setOpenDialog);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                if (!token) return;
                await _axios.post('/v1/auth/verify-email', { verificationToken: token });

                Swal.fire({
                    title: t('common.success'),
                    text: t('auth.verify_success'),
                    icon: 'success',
                    confirmButtonColor: '#f59e0b'
                });
            } catch (error) {
                console.log('Error verifying email: ', error);
                Swal.fire({
                    title: t('common.error'),
                    text: t('auth.verify_failed'),
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        };
        verifyEmail();
    }, [searchParams]);

    useEffect(() => {
        if (hoveredItem === 'popular') {
            flameRef.current?.startAnimation();
        } else {
            flameRef.current?.stopAnimation();
        }
        if (hoveredItem === 'upcoming') {
            trendingRef.current?.startAnimation();
        } else {
            trendingRef.current?.stopAnimation();
        }
    }, [hoveredItem]);

    useEffect(() => {
        fetchMoviesByStatus(0, 8);
        fetchMoviesByStatus(1, 8);
        fetchPopularMovies(8);
    }, [fetchMoviesByStatus, fetchPopularMovies]);

    const nowPlayingMovies = moviesByStatusMap[0] ?? [];
    const upcomingMovies = moviesByStatusMap[1] ?? [];
    const isLoadingNowPlaying = isFetchingMoviesByStatus;
    const isLoadingUpcoming = isFetchingMoviesByStatus;
    const isLoadingPopular = isFetchingPopularMovies;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 left-1/4 w-125 h-125 bg-amber-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-full max-w-480 md:pt-5">
                    <Carousel />
                </div>

                {/* --- Movie Explorer Section --- */}
                <section className="relative w-full max-w-7xl px-4 md:px-6 py-12 md:py-20 flex flex-col gap-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-10 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                            <div className="flex flex-col">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
                                    {t('home.explore_title')}
                                </h2>
                                <p className="text-xs font-bold tracking-[0.3em] text-amber-500 uppercase opacity-80">
                                    {t('home.explore_subtitle')}
                                </p>
                            </div>
                        </div>

                        <Tabs
                            key="movie-tabs"
                            aria-label="Movie categories"
                            variant="underlined"
                            selectedKey={selectedTab}
                            onSelectionChange={(key) => setSelectedTab(key as string)}
                            classNames={{
                                tabList: "bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-white/5 p-1 rounded-full",
                                cursor: "bg-amber-500 shadow-lg shadow-amber-500/20 rounded-full",
                                tab: "h-8 md:h-10 px-4 md:px-6",
                                tabContent: "font-bold text-xs md:text-sm tracking-wider"
                            }}
                        >
                            <Tab key="now-playing" title={
                                <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('nowplaying')} onMouseLeave={() => setHoveredItem(null)}>
                                    <Cctv animate={hoveredItem === 'nowplaying'} size={18} />
                                    <span>{t('home.tabs.now_playing')}</span>
                                </div>
                            } />
                            <Tab key="coming-soon" title={
                                <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('upcoming')} onMouseLeave={() => setHoveredItem(null)}>
                                    <TrendingUpIcon ref={trendingRef} size={18} />
                                    <span>{t('home.tabs.coming_soon')}</span>
                                </div>
                            } />
                            <Tab key="popular" title={
                                <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('popular')} onMouseLeave={() => setHoveredItem(null)}>
                                    <FlameIcon ref={flameRef} size={18} />
                                    <span>{t('home.tabs.popular')}</span>
                                </div>
                            } />
                        </Tabs>
                    </div>

                    <div className="relative min-h-100">
                        <div className={cn(
                            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-500",
                            "animate-in fade-in slide-in-from-bottom-4"
                        )}>
                            {selectedTab === 'now-playing' && (
                                isLoadingNowPlaying ? (
                                    Array.from({ length: 8 }).map((_, index) => <CardSkeleton key={index} />)
                                ) : (
                                    nowPlayingMovies.map((movie) => <CardMovie movie={movie} index={0} key={movie.movie_id} />)
                                )
                            )}

                            {selectedTab === 'coming-soon' && (
                                isLoadingUpcoming ? (
                                    Array.from({ length: 8 }).map((_, index) => <CardSkeleton key={index} />)
                                ) : (
                                    upcomingMovies.map((movie) => <CardMovie movie={movie} index={0} key={movie.movie_id} />)
                                )
                            )}

                            {selectedTab === 'popular' && (
                                isLoadingPopular ? (
                                    Array.from({ length: 8 }).map((_, index) => <CardSkeleton key={index} />)
                                ) : (
                                    popularMovies.map((movie) => <CardMovie movie={movie} index={0} key={movie.movie_id} />)
                                )
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button
                            variant="outline"
                            onMouseEnter={() => setHoveredItem("see-more")}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => router.push('/movies')}
                            className="group h-12 px-8 border-amber-500/50 text-amber-600 dark:text-amber-500 font-bold hover:bg-amber-500 hover:text-white transition-all duration-300 rounded-sm cursor-pointer"
                        >
                            {t('home.see_more')}
                            <ChevronRight animate={hoveredItem === "see-more"} size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </section>

                <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />

                {/* --- Special Offers Section --- */}
                <section className="w-full max-w-7xl px-4 md:px-6 py-16 md:py-24 space-y-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase">
                            {t('home.special_offers')}
                        </h2>
                        <div className="w-20 h-1 bg-amber-500 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                src: "https://cdn.galaxycine.vn/media/2026/2/3/tang-qua-nam-moi-3_1770109637475.jpg",
                                title: t('home.offers.offer1_title'),
                                desc: t('home.offers.offer1_desc')
                            },
                            {
                                src: "https://www.galaxycine.vn/media/2025/9/4/momo-galaxy-2_1756958593143.jpg",
                                title: t('home.offers.offer2_title'),
                                desc: t('home.offers.offer2_desc')
                            },
                            {
                                src: "https://www.galaxycine.vn/media/2025/1/22/bangqltv-digital-1135x660_1737516350592.jpg",
                                title: t('home.offers.offer3_title'),
                                desc: t('home.offers.offer3_desc')
                            }
                        ].map((offer) => (
                            <Card 
                                key={offer.title} 
                                isPressable 
                                className="border-none bg-white dark:bg-zinc-900 shadow-md hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-sm"
                            >
                                <CardBody className="p-0 overflow-hidden ">
                                    <Image
                                        alt={offer.title}
                                        src={offer.src}
                                        className="w-full aspect-video rounded-t-sm rounded-b-none object-cover group-hover:scale-110 transition-transform duration-700"
                                        removeWrapper
                                    />
                                </CardBody>

                                <CardFooter className="flex flex-col items-start p-6 gap-2">
                                    <h3 className="text-lg font-black leading-tight group-hover:text-amber-500 transition-colors">
                                        {offer.title}
                                    </h3>
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        {offer.desc}
                                    </p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* --- Interactive Feature Banner --- */}
                <section className="relative w-full py-20 flex flex-col items-center justify-center overflow-hidden bg-zinc-950 border-t-1 border-b-1 border-zinc-200/50 dark:border-white/5">
                    <div className="absolute inset-0 z-0">
                        <Meteors number={40} />
                        <div className="absolute inset-0 bg-linear-to-b from-zinc-950 via-transparent to-zinc-950" />
                    </div>

                    <div className="max-w-7xl w-full px-6 grid md:grid-cols-2 items-center gap-12 relative z-10">
                        <div className="flex justify-center md:justify-start">
                            <div className="w-64 lg:w-72 drop-shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                                <Iphone src="/banner.png" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8">
                            <div className="space-y-4">
                                <h2 className="font-black text-white leading-tight">
                                    <SparklesText>{t('home.banner.book_online')}</SparklesText>
                                    <span className="block mt-2">
                                        <AuroraText>{t('home.banner.no_delay')}</AuroraText>
                                    </span>
                                </h2>
                                <p className="text-lg text-white/60 font-medium max-w-xl">
                                    {t('home.banner.desc')}
                                </p>
                            </div>
                            
                            <Button 
                                size="lg" 
                                className="bg-amber-500 text-white font-black px-10 h-10 text-lg hover:bg-amber-600 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] rounded-full cursor-pointer"
                                onClick={() => {
                                    if (!authUser) {
                                        setOpenDialog('signin');
                                    } else {
                                        router.push('/booking');
                                    }
                                }}
                            >
                                {t('navbar.buy_tickets_now')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* --- About / Content Section --- */}
                <section className="w-full px-6 py-20">
                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-xl p-8 md:p-16 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                            <Film size={200} />
                        </div>

                        <div className="relative z-10 space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1 bg-amber-500 rounded-full" />
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">
                                    {t('home.about.title')}
                                </h2>
                            </div>

                            <div className="flex flex-col gap-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg text-justify">
                                <p>
                                    <span className="font-bold text-zinc-900 dark:text-white">MilkyWayyy Cinema</span> {t('home.about.p1')}
                                </p>

                                <p>
                                    {t('home.about.p2')}
                                </p>

                                <p>
                                    {t('home.about.p3')}
                                </p>

                                <p>
                                    {t('home.about.p4')}
                                </p>

                                <p className="italic text-amber-500/80 font-bold border-l-4 border-amber-500 pl-6 my-4">
                                    {t('home.about.promo')}
                                </p>

                                <p>
                                    {t('home.about.p5')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

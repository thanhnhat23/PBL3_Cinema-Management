
'use client';
import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMovieStore } from "@/stores/useMovieStore";
import { Tabs, Tab, Pagination } from '@heroui/react';
import { Cctv } from "@/components/icons/cctv";
import { FlameIcon, type FlameIconHandle } from "@/components/icons/flame";
import { CardMovie } from "@/components/layout/cardMovie";
import CardMovieSkeleton from "@/components/skeletons/cardMovie";
import { BlurFade } from "@/components/ui/effects/blur-fade";
import { TrendingUpIcon, type TrendingUpIconHandle } from "@/components/icons/trending-up";
import { Input } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
export const dynamic = "force-dynamic";

export default function MoviesWrapper() {
  return (
    <Suspense>
      <Movies />
    </Suspense>
  );
}

function Movies() {
    const searchParams = useSearchParams();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasLoadedNowPlaying, setHasLoadedNowPlaying] = useState<boolean>(false);
    const [hasLoadedComingSoon, setHasLoadedComingSoon] = useState<boolean>(false);
    const [hasLoadedPopular, setHasLoadedPopular] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const pageSize = 16;

    const tabParam = searchParams.get('tab');
    const [selectedTab, setSelectedTab] = useState<string>(() => {
        if (tabParam && ['nowplaying', 'coming-soon', 'popular'].includes(tabParam)) {
            return tabParam;
        }
        return 'nowplaying';
    });

    const flameRef = useRef<FlameIconHandle | null>(null);
    const trendingRef = useRef<TrendingUpIconHandle | null>(null);

    const fetchMoviesByStatus = useMovieStore(state => state.fetchMoviesByStatus);
    const fetchPopularMovies = useMovieStore(state => state.fetchPopularMovies);
    const moviesByStatusMap = useMovieStore(state => state.moviesByStatusMap);
    const popularMovies = useMovieStore(state => state.popularMovies);
    const isFetchingMoviesByStatus = useMovieStore(state => state.isFetchingMoviesByStatus);
    const isFetchingPopularMovies = useMovieStore(state => state.isFetchingPopularMovies);

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
        const fetchDataByTab = async () => {
            const fetchLimit = 10000;

            if (selectedTab === 'nowplaying' && !hasLoadedNowPlaying) {
                await fetchMoviesByStatus(0, fetchLimit);
                setHasLoadedNowPlaying(true);
                return;
            }

            if (selectedTab === 'coming-soon' && !hasLoadedComingSoon) {
                await fetchMoviesByStatus(1, fetchLimit);
                setHasLoadedComingSoon(true);
                return;
            }

            if (selectedTab === 'popular' && !hasLoadedPopular) {
                await fetchPopularMovies(fetchLimit);
                setHasLoadedPopular(true);
            }
        };

        fetchDataByTab();
    }, [
        selectedTab,
        fetchMoviesByStatus,
        fetchPopularMovies,
        hasLoadedNowPlaying,
        hasLoadedComingSoon,
        hasLoadedPopular,
    ]);

    const nowPlayingMovies = useMemo(() => {
        const list = moviesByStatusMap[0] ?? [];
        return list.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [moviesByStatusMap, searchQuery]);

    const upcomingMovies = useMemo(() => {
        const list = moviesByStatusMap[1] ?? [];
        return list.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [moviesByStatusMap, searchQuery]);

    const filteredPopularMovies = useMemo(() => {
        return popularMovies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [popularMovies, searchQuery]);

    const isLoadingNowPlaying = selectedTab === 'nowplaying' && isFetchingMoviesByStatus;
    const isLoadingUpcoming = selectedTab === 'coming-soon' && isFetchingMoviesByStatus;
    const isLoadingPopular = selectedTab === 'popular' && isFetchingPopularMovies;

    const totalNowPlayingPages = Math.max(1, Math.ceil(nowPlayingMovies.length / pageSize));
    const totalUpcomingPages = Math.max(1, Math.ceil(upcomingMovies.length / pageSize));
    const totalPopularPages = Math.max(1, Math.ceil(filteredPopularMovies.length / pageSize));

    const pagedNowPlayingMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return nowPlayingMovies.slice(start, start + pageSize);
    }, [nowPlayingMovies, page]);

    const pagedUpcomingMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return upcomingMovies.slice(start, start + pageSize);
    }, [upcomingMovies, page]);

    const pagedPopularMovies = useMemo(() => {
        const sortedPopular = [...filteredPopularMovies].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
        const start = (page - 1) * pageSize;
        return sortedPopular.slice(start, start + pageSize);
    }, [filteredPopularMovies, page]);

    return (
        <div className="flex flex-col items-center">
            {/* Cinematic Hero Section */}
            <div className="w-full relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-sidebar">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-background z-10 dark:from-black/60 dark:via-black/20" />
                    <div className="absolute inset-0 bg-linear-to-r from-white/40 via-transparent to-white/40 dark:from-black/80 dark:to-black/80 z-10" />
                    <div className="w-full h-full blur-sm scale-110">
                         <Image 
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
                            className="w-full h-full object-cover" 
                            alt="Theater Background" 
                            width={2000}
                            height={1000}
                        />
                    </div>
                </div>

                <div className="relative z-20 text-center flex flex-col items-center gap-6 px-4">
                    <BlurFade delay={0.1} inView>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/10 backdrop-blur-md border border-zinc-200 dark:border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-white/80 shadow-2xl">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Premium Experience
                        </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.2} inView>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-sidebar uppercase drop-shadow-2xl">
                            Thế giới <span className="text-transparent bg-clip-text bg-linear-to-b from-orange-400 to-amber-600">Điện ảnh</span>
                        </h1>
                    </BlurFade>

                    <BlurFade delay={0.3} inView>
                        <p className="text-zinc-400 font-medium max-w-xl text-sm md:text-base leading-relaxed drop-shadow-md">
                            Những siêu phẩm điện ảnh mới nhất, từ những bom tấn hành động đến những câu chuyện đầy cảm xúc.
                        </p>
                    </BlurFade>

                    <BlurFade delay={0.4} inView>
                        <div className="w-full md:w-xl mt-4">
                            <Input
                                placeholder="Tìm kiếm phim theo tên..."
                                value={searchQuery}
                                onValueChange={(val) => {
                                    setSearchQuery(val);
                                    setPage(1);
                                }}
                                startContent={<FiSearch className="text-zinc-400" size={18} />}
                                classNames={{
                                    inputWrapper: "bg-zinc-100/10 dark:bg-zinc-900/40 border-2 border-zinc-200/20 dark:border-white/10 h-12 rounded-full backdrop-blur-xl focus-within:ring-2 focus-within:ring-amber-500/50 transition-all shadow-2xl px-4",
                                    input: "text-base font-medium text-white placeholder:text-zinc-500",
                                }}
                            />
                        </div>
                    </BlurFade>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative -mt-16 z-30 w-full md:w-[75%] flex flex-col gap-8 py-20">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-sm p-4 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/5">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">Danh sách phim</h2>
                        </div>
                        
                        <Tabs 
                            key="tabs" 
                            aria-label="Movie filter tabs" 
                            variant="underlined" 
                            selectedKey={selectedTab}
                            onSelectionChange={(key) => {
                                setSelectedTab(key as string);
                                setPage(1);
                            }}
                            classNames={{
                                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                                cursor: "w-full bg-amber-500 h-1",
                                tab: "max-w-fit px-0 h-12",
                                tabContent: "group-data-[selected=true]:text-amber-500 font-black uppercase text-xs tracking-widest transition-colors duration-300"
                            }}
                        >
                            <Tab key="nowplaying" title={
                                    <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('nowplaying')} onMouseLeave={() => setHoveredItem(null)}>
                                        <Cctv animate={hoveredItem === 'nowplaying'} size={18} />
                                        <span>Đang chiếu</span>
                                    </div>
                                }
                            />

                            <Tab key="coming-soon" title={
                                    <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('upcoming')} onMouseLeave={() => setHoveredItem(null)}>
                                        <TrendingUpIcon ref={trendingRef} size={18} />
                                        <span>Sắp chiếu</span>
                                    </div>
                                } 
                            />

                            <Tab key="popular" title={
                                    <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('popular')} onMouseLeave={() => setHoveredItem(null)}>
                                        <FlameIcon ref={flameRef} size={18} />
                                        <span>Phổ biến</span>
                                    </div>
                                } 
                            />
                        </Tabs>
                    </div>
                
                {selectedTab === 'nowplaying' && (
                    <div className="flex flex-col items-center">
                        <div className="gap-4 md:gap-8 grid grid-cols-2 sm:grid-cols-4 p-2">
                            {isLoadingNowPlaying ? (
                                Array.from({ length: 16 }).map((_, index) => (
                                    <CardMovieSkeleton key={index} />
                                ))
                            ) : (
                                pagedNowPlayingMovies.map((movie, index) => (
                                    <BlurFade key={movie.movie_id} delay={index * 0.05} inView>
                                        <CardMovie movie={movie} index={index} />
                                    </BlurFade>
                                ))
                            )}
                        </div>

                        <Pagination
                            page={page}
                            total={totalNowPlayingPages}
                            onChange={setPage}
                            classNames={{
                                wrapper: "gap-2 mt-4 justify-center",
                                item: "bg-zinc-200 dark:bg-zinc-600"
                            }}
                        />
                    </div>
                )}
                
                {selectedTab === 'coming-soon' && (
                    <div className="flex flex-col items-center">
                        <div className="gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8 ">
                            {isLoadingUpcoming ? (
                                Array.from({ length: 16 }).map((_, index) => (
                                    <CardMovieSkeleton key={index} />
                                ))
                            ) : (
                                pagedUpcomingMovies.map((movie, index) => (
                                    <BlurFade key={movie.movie_id} delay={index * 0.05} inView>
                                        <CardMovie movie={movie} index={index} />
                                    </BlurFade>
                                ))
                            )}
                        </div>

                        <Pagination
                            page={page}
                            total={totalUpcomingPages}
                            onChange={setPage}
                            classNames={{
                                wrapper: "gap-2 mt-4 justify-center",
                                item: "bg-zinc-200 dark:bg-zinc-600"
                            }}
                        />
                    </div>
                )}
                
                {selectedTab === 'popular' && (
                    <div className="flex flex-col items-center">
                        <div className="gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8 ">
                            {isLoadingPopular ? (
                                Array.from({ length: 16 }).map((_, index) => (
                                    <CardMovieSkeleton key={index} />
                                ))
                            ) : (
                                pagedPopularMovies.map((movie, index) => (
                                    <BlurFade key={movie.movie_id} delay={index * 0.05} inView>
                                        <CardMovie movie={movie} index={index} />
                                    </BlurFade>
                                ))
                            )}
                        </div>

                        <Pagination
                            page={page}
                            total={totalPopularPages}
                            onChange={setPage}
                            classNames={{
                                wrapper: "gap-2 mt-4 justify-center",
                                item: "bg-zinc-200 dark:bg-zinc-600"
                            }}
                        />
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}
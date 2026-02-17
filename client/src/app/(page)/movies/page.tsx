'use client'

import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useMovieStore } from "@/stores/useMovieStore";
import { Tabs,Tab, Pagination } from '@heroui/react';
import { Cctv } from "@/components/icons/cctv";
import { FlameIcon, type FlameIconHandle } from "@/components/icons/flame";
import { TrendingUpIcon } from "@/components/icons/trending-up";
import { CardLayout } from "@/components/layout/card";
import CardSkeleton from "@/components/skeletons/card";
import { BlurFade } from "@/components/ui/effects/blur-fade";

export default function Movies() {
    const searchParams = useSearchParams();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const pageSize = 16;

    const tabParam = searchParams.get('tab');
    const [selectedTab, setSelectedTab] = useState<string>(() => {
        if (tabParam && ['nowplaying', 'coming-soon', 'popular'].includes(tabParam)) {
            return tabParam;
        }
        return 'nowplaying';
    });

    const flameRef = useRef<FlameIconHandle | null>(null);
    const trendingRef = useRef<FlameIconHandle | null>(null);

    const { 
        fetchAllMovies,
        movies,
        isFetchingMovies,
    } = useMovieStore();

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
        fetchAllMovies();
    }, [fetchAllMovies]);

    const nowPlayingMovies = useMemo(() => {
        return movies.filter(movie => movie.status === 0).sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    }, [movies]);

    const upcomingMovies = useMemo(() => {
        return movies.filter(movie => movie.status === 1).sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    }, [movies]);

    const popularMovies = useMemo(() => {
        return [...movies].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    }, [movies]);

    const totalNowPlayingPages = Math.max(1, Math.ceil(nowPlayingMovies.length / pageSize));
    const totalUpcomingPages = Math.max(1, Math.ceil(upcomingMovies.length / pageSize));
    const totalPopularPages = Math.max(1, Math.ceil(popularMovies.length / pageSize));

    const pagedNowPlayingMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return nowPlayingMovies.slice(start, start + pageSize);
    }, [nowPlayingMovies, page]);

    const pagedUpcomingMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return upcomingMovies.slice(start, start + pageSize);
    }, [upcomingMovies, page]);

    const pagedPopularMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return popularMovies.slice(start, start + pageSize);
    }, [popularMovies, page]);

    useEffect(() => {
        setPage(1);
    }, [selectedTab]);

    return (
        <div className="min-h-screen px-8 flex items-center justify-center">
            <div className="relative my-4 md:my-8 flex flex-col gap-4 md:max-w-[72%]">
                <div className="flex flex-col md:flex-row gap-2 items-center justify-start">
                    <span className="md:inline hidden w-1 h-8 bg-black dark:bg-white"></span>
                    <h1 className="inline md:hidden text-2xl font-bold">Xem gì hôm nay?</h1>
                    <h1 className="md:inline hidden text-3xl font-bold">Phim</h1>
                    <Tabs 
                        key="tabs" 
                        aria-label="Tabs variants" 
                        variant="underlined" 
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        size="md"
                        className="md:text-lg text-md font-semibold ml-0 md:ml-4"
                    >
                        <Tab key="nowplaying" title={
                                <div className="flex" onMouseEnter={() => setHoveredItem('nowplaying')} onMouseLeave={() => setHoveredItem(null)}>
                                    <Cctv 
                                        animate={hoveredItem === 'nowplaying'}
                                        className="inline w-5 h-5 mr-2 mb-1" 
                                        size={18}
                                    />
                                    <span>Đang chiếu</span>
                                </div>
                            }
                        />

                        <Tab key="coming-soon" title={
                                <div className="flex" onMouseEnter={() => setHoveredItem('upcoming')} onMouseLeave={() => setHoveredItem(null)}>
                                    <TrendingUpIcon 
                                        ref={trendingRef}
                                        className="inline w-5 h-5 mr-2 mb-1" 
                                        size={18}
                                    />
                                    <span>Sắp chiếu</span>
                                </div>
                            } 
                        />

                        <Tab key="popular" title={
                                <div className="flex" onMouseEnter={() => setHoveredItem('popular')} onMouseLeave={() => setHoveredItem(null)}>
                                    <FlameIcon 
                                        ref={flameRef}
                                        className="inline w-5 h-5 mr-2 mb-1" 
                                        size={18}
                                    />
                                    <span>Phổ biến</span>
                                </div>
                            } 
                        />
                    </Tabs>
                </div>
                
                {selectedTab === 'nowplaying' && (
                    <div className="flex flex-col items-center">
                        <div className="min-h-screen gap-4 md:gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8">
                            {isFetchingMovies ? (
                                Array.from({ length: 16 }).map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            ) : (
                                pagedNowPlayingMovies.map((movie, index) => (
                                    <BlurFade key={index} delay={index * 0.05} inView>
                                        <CardLayout movie={movie} index={index} key={index} width="w-52" height="h-64" />
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
                        <div className="min-h-screen gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8 ">
                            {isFetchingMovies ? (
                                Array.from({ length: 16 }).map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            ) : (
                                pagedUpcomingMovies.map((movie, index) => (
                                    <BlurFade key={index} delay={index * 0.05} inView>
                                        <CardLayout movie={movie} index={index} key={index} width="w-52" height="h-64" />
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
                        <div className="min-h-screen gap-8 grid grid-cols-2 sm:grid-cols-4 p-2 md:pt-8 ">
                            {isFetchingMovies ? (
                                Array.from({ length: 16 }).map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            ) : (
                                pagedPopularMovies.map((movie, index) => (
                                    <BlurFade key={index} delay={index * 0.05} inView>
                                        <CardLayout movie={movie} index={index} key={index} width="w-52" height="h-64" />
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
    )
}
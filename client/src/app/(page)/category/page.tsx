"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination, Input } from "@heroui/react";
import { CardMovie } from "@/components/layout/cardMovie";
import CardMovieSkeleton from "@/components/skeletons/cardMovie";
import { BlurFade } from "@/components/ui/effects/blur-fade";
import { useMovieStore } from "@/stores/useMovieStore";
import { useGenreStore } from "@/stores/useGenreStore";
import { FiSearch } from "react-icons/fi";

export default function CategoryPage() {
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [minRating, setMinRating] = useState<string>("0");
    const pageSize = 16;

    const {
        movies,
        moviesByGenre,
        isFetchingMovies,
        isFetchingMoviesByGenre,
        fetchAllMovies,
        fetchMoviesByGenre,
    } = useMovieStore();
    const { genres, isFetchingGenres, fetchAllGenres } = useGenreStore();

    useEffect(() => {
        fetchAllGenres();
    }, [fetchAllGenres]);

    useEffect(() => {
        if (selectedTab === "all") {
            fetchAllMovies();
            return;
        }

        fetchMoviesByGenre(Number(selectedTab), 1000);
    }, [selectedTab, fetchAllMovies, fetchMoviesByGenre]);

    const filteredMovies = useMemo(() => {
        const baseList = selectedTab === "all" ? movies : moviesByGenre;
        
        return baseList.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRating = Number(movie.vote_average) >= Number(minRating);
            return matchesSearch && matchesRating;
        });
    }, [movies, moviesByGenre, selectedTab, searchQuery, minRating]);

    const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));

    const pagedMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredMovies.slice(start, start + pageSize);
    }, [filteredMovies, page]);

    const isLoading =
        isFetchingGenres ||
        (selectedTab === "all" ? isFetchingMovies : isFetchingMoviesByGenre);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Elegant Header Section */}
            <div className="w-full bg-sidebar py-16 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 via-transparent to-amber-500/10" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <BlurFade delay={0.1}>
                        <div className="flex flex-col items-start gap-4">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Genre Discovery
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase drop-shadow-2xl">
                                Phim theo <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-600">Thể loại</span>
                            </h1>
                            <p className="text-zinc-500 font-medium max-w-xl text-sm md:text-base leading-relaxed">
                                Danh sách phim theo sở thích cá nhân của bạn. Từ hành động kịch tính đến tình cảm lãng mạn, tất cả đều có tại đây.
                            </p>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.2}>
                        <div className="flex flex-col gap-6 w-full md:w-auto min-w-[320px]">
                            <div className="w-full md:w-md mt-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Tìm kiếm phim</span>
                                <Input
                                    placeholder="Nhập tên phim..."
                                    value={searchQuery}
                                    onValueChange={(val) => {
                                        setSearchQuery(val);
                                        setPage(1);
                                    }}
                                    startContent={<FiSearch className="text-zinc-400" />}
                                    classNames={{
                                        inputWrapper: "bg-zinc-100/10 dark:bg-zinc-900/40 border-2 border-zinc-200/20 dark:border-white/10 h-12 rounded-full backdrop-blur-xl focus-within:ring-2 focus-within:ring-amber-500/50 transition-all shadow-2xl px-4",
                                        input: "text-base font-medium text-white placeholder:text-zinc-500",
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="w-full">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Lọc theo Thể loại</span>
                                    <Select
                                        value={selectedTab}
                                        onValueChange={(value) => {
                                            setSelectedTab(value);
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-bold h-14 rounded-2xl shadow-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                                            <SelectValue placeholder="Chọn thể loại" />
                                        </SelectTrigger>

                                        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-2xl shadow-2xl">
                                            <SelectGroup>
                                                <SelectLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 p-4 pb-2">Danh sách thể loại</SelectLabel>
                                                <SelectItem value="all" className="font-semibold cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800">Tất cả phim</SelectItem>
                                                {genres.map((genre) => (
                                                    <SelectItem key={genre.genreId} value={String(genre.genreId)} className="font-semibold cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800">
                                                        {genre.genre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-full">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Đánh giá tối thiểu</span>
                                    <Select
                                        value={minRating}
                                        onValueChange={(value) => {
                                            setMinRating(value);
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-bold h-14 rounded-2xl shadow-xl">
                                            <SelectValue placeholder="Đánh giá" />
                                        </SelectTrigger>

                                        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-2xl shadow-2xl">
                                            <SelectGroup>
                                                <SelectLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 p-4 pb-2">Chọn mức đánh giá</SelectLabel>
                                                {[0, 3, 5, 7, 8, 9].map((rating) => (
                                                    <SelectItem key={rating} value={String(rating)} className="font-semibold cursor-pointer">
                                                        {rating === 0 ? "Tất cả" : `${rating}+ Sao`}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center">
                    <div className="gap-6 md:gap-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 w-full">
                        {isLoading ? (
                            Array.from({ length: 16 }).map((_, index) => (
                                <CardMovieSkeleton key={index} />
                            ))
                        ) : (
                            pagedMovies.map((movie, index) => (
                                <BlurFade key={movie.movie_id} delay={index * 0.05} inView>
                                    <CardMovie movie={movie} index={index} />
                                </BlurFade>
                            ))
                        )}
                    </div>

                    {!isLoading && totalPages > 1 ? (
                        <div className="flex justify-center mt-20">
                            <Pagination
                                page={page}
                                total={totalPages}
                                onChange={setPage}
                                classNames={{
                                    wrapper: "gap-2",
                                    item: "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold",
                                    cursor: "bg-amber-500 text-white font-black"
                                }}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
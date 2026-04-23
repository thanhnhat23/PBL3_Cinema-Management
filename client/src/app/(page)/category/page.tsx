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
import { Pagination } from "@heroui/react";
import { CardMovie } from "@/components/layout/cardMovie";
import CardMovieSkeleton from "@/components/skeletons/cardMovie";
import { BlurFade } from "@/components/ui/effects/blur-fade";
import { useMovieStore } from "@/stores/useMovieStore";
import { useGenreStore } from "@/stores/useGenreStore";

export default function CategoryPage() {
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [page, setPage] = useState<number>(1);
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
        return selectedTab === "all" ? movies : moviesByGenre;
    }, [movies, moviesByGenre, selectedTab]);

    const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));

    const pagedMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredMovies.slice(start, start + pageSize);
    }, [filteredMovies, page]);

    const isLoading =
        isFetchingGenres ||
        (selectedTab === "all" ? isFetchingMovies : isFetchingMoviesByGenre);

    return (
        <div className="min-h-screen px-8 flex items-start justify-center">
            <div className="relative my-4 md:my-8 flex flex-col gap-4 md:w-[72%]">
                <div className="w-full flex justify-between items-center">
                    <div className="flex gap-2">
                        <span className="md:inline hidden w-1 h-8 bg-black dark:bg-white"></span>
                        <h1 className="text-3xl font-bold">Thể loại</h1>
                    </div>
                    
                    <Select
                        value={selectedTab}
                        onValueChange={(value) => {
                            setSelectedTab(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Chọn thể loại" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Thể loại</SelectLabel>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {genres.map((genre) => (
                                    <SelectItem key={genre.genreId} value={String(genre.genreId)}>
                                        {genre.genre}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col items-center">
                    <div className="gap-4 md:gap-8 grid grid-cols-2 sm:grid-cols-4 p-2">
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

                    {!isLoading ? (
                        <Pagination
                            page={page}
                            total={totalPages}
                            onChange={setPage}
                            classNames={{
                                wrapper: "gap-2 mt-4 justify-center",
                                item: "bg-zinc-200 dark:bg-zinc-600"
                            }}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
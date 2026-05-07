"use client";
import { MotionCarousel } from "@/components/ui/motion-carousel";
import { EmblaOptionsType } from "embla-carousel";
import { useMovieStore } from "@/stores/useMovieStore";
import { useMemo } from "react";

const getBackdropSrc = (path?: string | null) => {
    if (!path) return "https://placehold.co/1200x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/original${path}`;
};

export default function Carousel() {
    const OPTIONS: EmblaOptionsType = { loop: true };
    const { moviesByStatusMap } = useMovieStore();
    
    const SLIDES = useMemo(() => {
        const nowPlaying = moviesByStatusMap[0] ?? [];

        const sortedMovies = [...nowPlaying].sort((a, b) => 
            new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
        const carouselMovies = sortedMovies.slice(0, 8);

        return carouselMovies.map((movie, index) => ({
            id: movie.movie_id,
            src: getBackdropSrc(movie.backdrop_path),
            alt: movie.title,
            title: movie.title,
            overview: movie.overview,
            priority: index === 0
        }));
    }, [moviesByStatusMap]);

    if (SLIDES.length === 0) return null;

    return (
        <div>
            <MotionCarousel slides={SLIDES} options={OPTIONS} />
        </div>
    );
}
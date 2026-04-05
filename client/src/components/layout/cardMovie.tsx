import { Card, CardFooter, Image, CardHeader } from "@heroui/react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { PlayIcon } from "../icons/play";
import { StarIcon } from "../icons/star";
import { GiRoundStar } from "react-icons/gi";
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent,
    DialogHeader, 
    DialogTitle,
} from "../ui/dialog";
import { useMovieStore, type Movie } from "@/stores/useMovieStore";
import { SparklesText } from "../ui/texts/sparkles-text";

interface DataMovieProps {
  movie: Movie;
  index: number;
  width?: string;
  height?: string;
  widthCard?: string;
  heightCard?: string;
}

export const CardMovie = ({
    movie,
    index,
    width = "w-52",
    height = "h-72",
    widthCard,
    heightCard,
}: DataMovieProps) => {
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState<number | null>(null);
    const { getStatusLabel } = useMovieStore();
    
    const OneDayLeftCurrentNow = useMemo(() => {
        return new Date(movie.release_date).getTime() - new Date().getTime() <= 1 * 24 * 60 * 60 * 1000;
    }, [movie.release_date]);
    
    return (
        <Link
            href={`/movies/${movie.movie_id}`}
            onClick={(event) => {
                if ((event.target as HTMLElement).closest("[data-card-action]")) {
                    event.preventDefault();
                }
            }}
            key={index}
        >
            <Card radius="md" className={`${widthCard} ${heightCard} group relative`}>
                <div className="absolute opacity-0 transition delay-50 duration-300 ease-in-out group-hover:opacity-100 hidden md:flex flex-col items-center justify-center backdrop-blur-xs w-full h-full gap-4 z-20">
                    <button
                        data-card-action
                        disabled={movie.status !== 0 && movie.status !== 1}
                        className={`min-w-24 px-6 py-2 rounded flex items-center justify-center gap-2 font-semibold ${
                            movie.status === 0 || (movie.status === 1 && OneDayLeftCurrentNow)
                                ? "bg-orange-400 text-yellow-100 cursor-pointer"
                                : "bg-zinc-400 text-zinc-100 cursor-not-allowed"
                        }`}
                        onMouseEnter={() => setHoveredItem("ticket")}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => {
                            if (movie.status === 0 || (movie.status === 1 && OneDayLeftCurrentNow)) {
                                router.push('/');
                            }
                        }}
                    >
                        <StarIcon animate={hoveredItem === "ticket"} size={18} />
                        Đặt vé
                    </button>

                    <Dialog open={isTrailerOpen === index} onOpenChange={(open) => setIsTrailerOpen(open ? index : null)}>
                        <DialogTrigger asChild>
                            <button
                                data-card-action
                                className="border-2 border-amber-400 hover:bg-amber-400/50 min-w-24 px-6 py-2 rounded flex items-center justify-center gap-2 text-yellow-300 font-semibold cursor-pointer"
                                onMouseEnter={() => setHoveredItem("trailer")}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <PlayIcon animate={hoveredItem === "trailer"} size={18} />
                                Trailer
                            </button>
                        </DialogTrigger>
                        
                        <DialogContent
                            from="top"
                            showCloseButton={true}
                            className="md:min-w-6xl min-w-full"
                        >
                            <DialogHeader>
                                <DialogTitle>Trailer {movie.title}</DialogTitle>
                            </DialogHeader>
                            {isTrailerOpen === index && (
                                <div className="w-full aspect-video">
                                    {movie.trailer_url ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${movie.trailer_url}?autoplay=1&mute=0&playsinline=1&rel=0`}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                            loading="lazy"
                                            className="w-full h-full"
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
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                <CardHeader className="absolute z-15 top-1 flex items-start! justify-between pointer-events-none">
                    <div
                        className={`hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full border-small border-white/50 shadow ${
                            movie.status === 0
                                ? "bg-green-600/70 shadow-green-700/30"
                                : movie.status === 1
                                    ? "bg-yellow-600/50 shadow-yellow-700/30"
                                    : "bg-red-600/50 shadow-red-700/30"
                        }`}
                    >
                        <span className="relative flex h-2 w-2">
                            <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                    movie.status === 0
                                        ? "bg-green-400"
                                        : movie.status === 1
                                            ? "bg-yellow-400"
                                            : "bg-red-400"
                                }`}
                            ></span>
                            <span
                                className={`relative inline-flex rounded-full h-2 w-2 ${
                                    movie.status === 0
                                        ? "bg-green-500"
                                        : movie.status === 1
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                }`}
                            ></span>
                        </span>
                        <span className="text-white/85 font-bold text-xs md:text-sm">
                            {getStatusLabel(movie.status)}
                        </span>
                    </div>

                    <div className="bg-black/40 gap-1 flex items-center justify-center px-2 py-1 rounded-sm">
                        <GiRoundStar className="text-yellow-500" />
                        <p className="text-sm md:text-md font-bold text-white text-center">{Number(movie.vote_average).toFixed(1)}</p>
                    </div>
                </CardHeader>

                <Image
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt="Now Playing"
                    className={`object-fill ${width} ${height} md:w-72 md:h-110`}
                />

                <CardFooter className="absolute bottom-0 z-15 justify-between pointer-events-none md:bg-black/40 md:backdrop-blur-[0.2rem]">
                    <Image
                        isBlurred
                        src="/logo.png"
                        alt="Logo"
                        className="object-fill min-w-8 w-8 md:min-w-10 md:w-10"
                    />
                    <p className="hidden md:inline text-xs font-bold text-white text-center max-w-[70%] subpixel-antialiased px-4">
                        {movie.title}
                    </p>
                    <div className={`px-2 py-1 flex items-center justify-center rounded-md ${movie.adult ? "bg-red-500" : "bg-orange-400"}`}>
                        <p className="text-sm md:text-md font-bold text-white text-center">{movie.adult ? "T18" : "T16"}</p>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
};
import { Card, CardFooter, Image, CardHeader } from "@heroui/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { useAuthStore } from "@/stores/useAuthStore";
import { useDialogStore } from "@/stores/useDialogStore";
import { useRouter } from "next/navigation";

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
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState<number | null>(null);
    const { t } = useTranslation();
    const getStatusLabel = useMovieStore(state => state.getStatusLabel);
    const authUser = useAuthStore(state => state.authUser);
    const setOpenDialog = useDialogStore(state => state.setOpenDialog);
    const router = useRouter();

    const OneDayLeftCurrentNow = useMemo(() => {
        return new Date(movie.release_date).getTime() - new Date().getTime() <= 1 * 24 * 60 * 60 * 1000;
    }, [movie.release_date]);

    return (
        <div className="relative group">
            <Link
                href={`/movies/${movie.movie_id}`}
                className="block"
                key={movie.movie_id}
            >
                <Card radius="sm" className={`${widthCard} ${heightCard} relative overflow-hidden border-none shadow-2xl transition-all duration-500 hover:shadow-orange-500/20 bg-white dark:bg-zinc-950`}>
                    {/* Image with hover blur and error fallback */}
                    <Image
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={movie.title}
                        onError={() => {
                            const img = document.querySelector(`img[alt="${movie.title}"]`) as HTMLImageElement;
                            if (img) img.src = "/h.png";
                        }}
                        className={`object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-xs ${width} ${height} md:w-72 md:h-110`}
                    />

                    {/* Status & Rating Badge Overlay - Unblurred on hover */}
                    <CardHeader className="absolute z-30 top-0 left-0 right-0 flex items-center justify-between p-3 pointer-events-none">
                        <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm backdrop-blur-md border border-white/20 shadow-lg ${movie.status === 0
                                ? "bg-emerald-500/40"
                                : movie.status === 1
                                    ? "bg-amber-500/40"
                                    : "bg-rose-500/40"
                                }`}
                        >
                            <span className="relative flex h-2 w-2">
                                <span
                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${movie.status === 0 ? "bg-emerald-400" : movie.status === 1 ? "bg-amber-400" : "bg-rose-400"
                                        }`}
                                ></span>
                                <span
                                    className={`relative inline-flex rounded-full h-2 w-2 ${movie.status === 0 ? "bg-emerald-500" : movie.status === 1 ? "bg-amber-500" : "bg-rose-500"
                                        }`}
                                ></span>
                            </span>
                            <span className="text-white font-black text-[10px] tracking-widest">
                                {t(`movie_status.${getStatusLabel(movie.status)}`)}
                            </span>
                        </div>

                        <div className="bg-black/60 backdrop-blur-md gap-1.5 md:flex hidden items-center justify-center px-2.5 py-1.5 rounded-sm border border-white/10 shadow-lg">
                            <GiRoundStar className="text-amber-400" size={14} />
                            <p className="text-xs font-black text-white">{Number(movie.vote_average).toFixed(1)}</p>
                        </div>
                    </CardHeader>

                    {/* Glassmorphic Footer - Unblurred on hover */}
                    <CardFooter className="absolute bottom-0 left-0 right-0 z-30 p-4 flex flex-col gap-2 items-start pointer-events-none bg-linear-to-t from-zinc-900/95 via-zinc-900/40 dark:from-black/95 dark:via-black/40 to-transparent">
                        <div className="flex w-full items-center justify-between gap-4">
                            <p className="md:text-sm text-xs font-black text-zinc-100 dark:text-white leading-tight drop-shadow-md truncate max-w-[80%] uppercase tracking-tighter">
                                {movie.title}
                            </p>
                            <div className={`px-2 py-0.5 rounded-sm text-[10px] font-black text-white flex items-center justify-center border border-white/20 ${movie.adult ? "bg-rose-600" : "bg-amber-500"}`}>
                                {movie.adult ? "T18" : "T16"}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                className="w-5 h-5 object-contain"
                            />
                            <span className="text-[10px] text-zinc-300 dark:text-white/80 font-bold tracking-[0.2em]">MilkyWayyy</span>
                        </div>
                    </CardFooter>
                </Card>
            </Link>

            {/* Immersive Button Overlay on Hover - Outside Link */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out hidden md:flex flex-col items-center justify-center bg-black/40 gap-4 z-40 pointer-events-none">
                <button
                    onClick={() => {
                        if (!authUser) {
                            setOpenDialog('signin');
                        } else {
                            if (movie.status === 0 || (movie.status === 1 && OneDayLeftCurrentNow)) {
                                router.push('/booking/' + movie.movie_id);
                            }
                        }
                    }}
                    className={`min-w-32 px-6 py-3 rounded-sm flex items-center justify-center gap-2 font-bold tracking-tight transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg pointer-events-auto ${movie.status === 0 || (movie.status === 1 && OneDayLeftCurrentNow)
                        ? "bg-linear-to-r from-orange-500 to-amber-500 text-white cursor-pointer hover:scale-105 active:scale-95"
                        : "bg-zinc-600 text-zinc-300 cursor-not-allowed pointer-events-none"
                        }`}
                    onMouseEnter={() => setHoveredItem("ticket")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <StarIcon animate={hoveredItem === "ticket"} size={20} />
                    <span>{t('movie_card.book_now')}</span>
                </button>

                <Dialog open={isTrailerOpen === index} onOpenChange={(open) => setIsTrailerOpen(open ? index : null)}>
                    <DialogTrigger asChild>
                        <button
                            className="min-w-32 px-6 py-3 rounded-sm border-2 border-white/30 hover:border-amber-400 hover:bg-amber-400/20 flex items-center justify-center gap-2 text-white font-bold tracking-tight transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 cursor-pointer pointer-events-auto"
                            onMouseEnter={() => setHoveredItem("trailer")}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <PlayIcon animate={hoveredItem === "trailer"} size={20} />
                            <span>{t('movie_card.watch_trailer')}</span>
                        </button>
                    </DialogTrigger>

                    <DialogContent
                        from="top"
                        showCloseButton={true}
                        className="md:min-w-6xl min-w-full bg-zinc-950/95 backdrop-blur-2xl border-white/10 rounded-sm"
                    >
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
                                {t('movie_card.trailer_label')}: {movie.title}
                            </DialogTitle>
                        </DialogHeader>
                        {isTrailerOpen === index && (
                            <div className="w-full aspect-video rounded-sm overflow-hidden border border-white/10 shadow-2xl">
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
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 gap-4">
                                        <SparklesText className="text-zinc-700 text-2xl md:text-5xl font-black">
                                            {t('movie_card.coming_soon')}
                                        </SparklesText>
                                        <p className="text-zinc-500 font-medium italic">{t('movie_card.trailer_preparing')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
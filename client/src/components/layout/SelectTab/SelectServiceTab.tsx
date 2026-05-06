import { ChevronDown, MapPin, Film, Calendar, Monitor } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import type { Cinema } from "@/stores/useCinemaStore";
import type { Location } from "@/stores/useLocationStore";
import type { Movie } from "@/stores/useMovieStore";
import type { ShowTime } from "@/stores/useShowTimeStore";

type SelectItem = {
    key: string;
    label: string;
    state: string;
};

type SelectServiceTabProps = {
    select: SelectItem[];
    showSelect: Record<string, boolean>;
    stateSelect: Record<string, string[]>;
    locations: Location[];
    cinemas: Cinema[];
    nowShowingMovies: Movie[];
    showtimes: ShowTime[];
    selectedCinema?: Cinema;
    isLoadingShoTimes?: boolean;
    onToggleSection: (key: string) => void;
    onSelectValue: (key: string, value: string[]) => void;
    onFetchShowtimes?: (location: string, cinemaId: number, movieId: number, date: string) => void;
};

function LocationSelector({
    locations,
    selected,
    onSelect,
}: {
    locations: Location[];
    selected: string;
    onSelect: (city: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-3">
            {locations.map((location) => {
                const isActive = selected === location.city;
                return (
                    <button
                        key={location.location_id}
                        type="button"
                        onClick={() => onSelect(location.city)}
                        className={cn(
                            "px-4 py-2 rounded-sm border font-bold text-xs uppercase tracking-widest transition-all duration-300",
                            isActive
                                ? "bg-amber-500 border-amber-500 text-white shadow-[0_5px_15px_rgba(245,158,11,0.3)] scale-105"
                                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-amber-500/50 hover:text-amber-500"
                        )}
                    >
                        {location.city}
                    </button>
                );
            })}
        </div>
    );
}

function MovieSelector({
    movies,
    selected,
    onSelect,
}: {
    movies: Movie[];
    selected: string;
    onSelect: (title: string) => void;
}) {
    const hasSelectedMovie = selected.length > 0;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => {
                const posterSrc = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : "/h.png";
                const isSelected = selected === movie.title;

                return (
                    <button
                        key={movie.movie_id}
                        type="button"
                        onClick={() => onSelect(movie.title)}
                        className="group relative flex flex-col gap-3 text-left"
                    >
                        <div className={cn(
                            "relative aspect-[2/3] rounded-sm overflow-hidden border-2 transition-all duration-500 cursor-pointer",
                            isSelected
                                ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-[1.02]"
                                : "border-transparent group-hover:border-amber-500/50 shadow-xl"
                        )}>
                            <Image
                                src={posterSrc}
                                alt={movie.title}
                                fill
                                className={cn(
                                    "object-cover transition-all duration-700",
                                    hasSelectedMovie && !isSelected ? "grayscale opacity-40 scale-95" : "grayscale-0 opacity-100 scale-100"
                                )}
                            />
                            {isSelected && (
                                <div className="absolute inset-0 bg-amber-500/10 backdrop-none" />
                            )}
                        </div>
                        <p className={cn(
                            "text-xs font-semibold tracking-tighter leading-tight transition-colors",
                            isSelected ? "text-amber-500" : "text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white"
                        )}>
                            {movie.title}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}

function DateSelector({
    dates,
    selectedDate,
    onSelect,
}: {
    dates: Array<{ dayLabel: string; dateLabel: string; value: string }>;
    selectedDate: string;
    onSelect: (date: string) => void;
}) {
    if (dates.length === 0) return null;

    return (
        <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">1. Chọn ngày chiếu</p>
            <div className="flex flex-wrap gap-3">
                {dates.map((date) => {
                    const isActive = selectedDate === date.value;
                    return (
                        <button
                            key={date.value}
                            type="button"
                            onClick={() => onSelect(date.value)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[100px] p-2 border rounded-sm transition-all duration-300 cursor-pointer",
                                isActive
                                    ? "bg-amber-500 border-amber-500 text-white shadow-lg scale-105"
                                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-amber-500/50"
                            )}
                        >
                            <span className="text-xs font-bold tracking-widest opacity-60 mb-1">{date.dayLabel}</span>
                            <span className="text-xs font-semibold">{date.dateLabel}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function CinemaSelector({
    cinemas,
    selectedCinemaId,
    onSelect,
}: {
    cinemas: Cinema[];
    selectedCinemaId: number | undefined;
    onSelect: (cinema: Cinema) => void;
}) {
    if (cinemas.length === 0) return null;

    return (
        <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">2. Chọn rạp</p>
            <div className="flex flex-wrap gap-3">
                {cinemas.map((cinema) => {
                    const isActive = selectedCinemaId === cinema.cinema_id;
                    return (
                        <button
                            key={cinema.cinema_id}
                            type="button"
                            onClick={() => onSelect(cinema)}
                            className={cn(
                                "px-4 py-2 border rounded-sm transition-all duration-300 cursor-pointer",
                                isActive
                                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xl scale-105"
                                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900/50 dark:hover:border-white/50"
                            )}
                        >
                            <span className="text-xs font-bold tracking-widest">{cinema.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function ShowtimeSelector({
    showtimes,
    selectedShowtimeId,
    isLoading,
    onSelect,
}: {
    showtimes: ShowTime[];
    selectedShowtimeId: string;
    isLoading: boolean;
    onSelect: (showtimeId: string) => void;
}) {
    return (
        <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">3. Chọn suất chiếu</p>
            {isLoading ? (
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-24 h-12 rounded-sm bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                    ))}
                </div>
            ) : showtimes.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                    {showtimes.map((st) => {
                        const isActive = selectedShowtimeId === st.showtime_id.toString();
                        return (
                            <button
                                key={st.showtime_id}
                                type="button"
                                onClick={() => onSelect(st.showtime_id.toString())}
                                className={cn(
                                    "px-4 py-2 border rounded-sm transition-all duration-300 cursor-pointer",
                                    isActive
                                        ? "bg-amber-500 border-amber-500 text-white shadow-lg scale-105"
                                        : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-amber-500/50 hover:text-amber-500"
                                )}
                            >
                                <span className="text-xs font-bold">
                                    {new Date(st.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-zinc-500 italic">Không có suất chiếu khả dụng</p>
            )}
        </div>
    );
}

export function SelectServiceTab({
    select,
    showSelect,
    stateSelect,
    locations,
    cinemas,
    nowShowingMovies,
    showtimes,
    selectedCinema,
    isLoadingShoTimes,
    onToggleSection,
    onSelectValue,
    onFetchShowtimes,
}: SelectServiceTabProps) {  
    const selectedLocation = stateSelect["select-location"]?.[0] ?? "";
    const selectedMovie = stateSelect["select-movie"]?.[0] ?? "";
    const selectedShowtimeDate = stateSelect["select-showtime"]?.[0] ?? "";
    const selectedShowtimeId = stateSelect["select-showtime"]?.[1] ?? "";

    const hasLocation = Boolean(selectedLocation);
    const hasMovie = Boolean(selectedMovie);

    const selectedMovieTitle = stateSelect["select-movie"]?.[0] ?? "";
    const selectedMovieId = nowShowingMovies.find(m => m.title === selectedMovieTitle)?.movie_id;
    
    const movieShowtimes = selectedMovieId 
        ? showtimes.filter(st => st.movie_id === selectedMovieId)
        : [];

    const getAvailableDatesFromShowtimes = (): Array<{
        dayLabel: string;
        dateLabel: string;
        value: string;
    }> => {
        const dateSet = new Set<string>();
        const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

        movieShowtimes.forEach((st) => {
            const date = new Date(st.startTime);
            const isoDate = date.toISOString().split("T")[0];
            dateSet.add(isoDate);
        });

        return Array.from(dateSet)
            .sort()
            .map((isoDate) => {
                const date = new Date(isoDate);
                const dayName = days[date.getDay()];
                const dateString = date.getDate().toString().padStart(2, "0");
                const monthString = (date.getMonth() + 1).toString().padStart(2, "0");
                const dateLabel = `${dateString}/${monthString}`;

                return {
                    dayLabel: dayName,
                    dateLabel: dateLabel,
                    value: isoDate,
                };
            });
    };

    const getAvailableCinemasForDate = (date: string): Cinema[] => {
        const cinemaIds = new Set<number>();

        movieShowtimes
            .filter((st) => {
                const stDate = new Date(st.startTime).toISOString().split("T")[0];
                return stDate === date;
            })
            .forEach((st) => {
                if (st.cinema_id) cinemaIds.add(st.cinema_id);
            });

        return cinemas.filter((c) => cinemaIds.has(c.cinema_id));
    };

    const getShowtimesForDateAndCinema = (date: string, cinemaId: number): ShowTime[] => {
        return movieShowtimes.filter((st) => {
            const stDate = new Date(st.startTime).toISOString().split("T")[0];
            return stDate === date && st.cinema_id === cinemaId;
        });
    };

    const availableDates = getAvailableDatesFromShowtimes();
    const cinemasForDate = selectedShowtimeDate ? getAvailableCinemasForDate(selectedShowtimeDate) : [];
    const showtimesForDateAndCinema =
        selectedShowtimeDate && selectedCinema
            ? getShowtimesForDateAndCinema(selectedShowtimeDate, selectedCinema.cinema_id)
            : [];
    
    const handleLocationSelect = (city: string) => {
        onSelectValue("select-location", [city]);
    };

    const handleMovieSelect = (title: string) => {
        onSelectValue("select-movie", [title]);
        onSelectValue("select-showtime", []);
        onSelectValue("select-cinema", []);

        if (hasLocation && onFetchShowtimes) {
            const movieId = nowShowingMovies.find(m => m.title === title)?.movie_id;
            if (movieId) onFetchShowtimes(selectedLocation, 0, movieId, "");
        }
    };

    const handleDateSelect = (date: string) => {
        onSelectValue("select-showtime", [date, ""]);
    };

    const handleCinemaSelect = (cinema: Cinema) => {
        onSelectValue("select-cinema", [cinema.cinema_id.toString()]);
    };

    const handleShowtimeSelect = (showtimeId: string) => {
        onSelectValue("select-showtime", [selectedShowtimeDate, showtimeId]);
    };

    const isUnlocked = (key: string): boolean => {
        switch (key) {
            case "select-location": return true;
            case "select-movie": return hasLocation;
            case "select-showtime": return hasLocation && hasMovie;
            default: return false;
        }
    };

    return (
        <div className="space-y-6">
            {select.map((item) => {
                const unlocked = isUnlocked(item.key);
                const icons: Record<string, any> = {
                    "select-location": <MapPin size={20} />,
                    "select-movie": <Film size={20} />,
                    "select-showtime": <Calendar size={20} />
                };

                return (
                    <SelectSectionCard
                        key={item.key}
                        item={item}
                        icon={icons[item.key]}
                        isExpanded={showSelect[item.key] ?? false}
                        isUnlocked={unlocked}
                        onToggle={() => onToggleSection(item.key)}
                    >
                        {item.key === "select-location" && (
                            <LocationSelector
                                locations={locations}
                                selected={selectedLocation}
                                onSelect={handleLocationSelect}
                            />
                        )}

                        {item.key === "select-movie" && (
                            <MovieSelector
                                movies={nowShowingMovies}
                                selected={selectedMovie}
                                onSelect={handleMovieSelect}
                            />
                        )}

                        {item.key === "select-showtime" && (
                            <div className="flex flex-col gap-8 w-full pt-2">
                                <DateSelector
                                    dates={availableDates}
                                    selectedDate={selectedShowtimeDate}
                                    onSelect={handleDateSelect}
                                />

                                {selectedShowtimeDate && (
                                    <CinemaSelector
                                        cinemas={cinemasForDate}
                                        selectedCinemaId={selectedCinema?.cinema_id}
                                        onSelect={handleCinemaSelect}
                                    />
                                )}

                                {selectedCinema && selectedShowtimeDate && (
                                    <ShowtimeSelector
                                        showtimes={showtimesForDateAndCinema}
                                        selectedShowtimeId={selectedShowtimeId}
                                        isLoading={isLoadingShoTimes ?? false}
                                        onSelect={handleShowtimeSelect}
                                    />
                                )}
                            </div>
                        )}
                    </SelectSectionCard>
                );
            })}
        </div>
    );
}

function SelectSectionCard({
    item,
    icon,
    isExpanded,
    isUnlocked,
    onToggle,
    children,
}: {
    item: SelectItem;
    icon?: React.ReactNode;
    isExpanded: boolean;
    isUnlocked: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className={cn(
            "group overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-xl border transition-all duration-500 rounded-sm",
            isExpanded ? "border-amber-500/50 shadow-2xl" : "border-zinc-200 dark:border-white/10 shadow-sm hover:border-amber-500/30"
        )}>
            <div 
                className={cn(
                    "flex items-center justify-between px-8 py-6 cursor-pointer",
                    !isUnlocked && "opacity-40 cursor-not-allowed"
                )}
                onClick={isUnlocked ? onToggle : undefined}
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        isExpanded ? "bg-amber-500 text-white shadow-lg" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    )}>
                        {icon}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">
                            {item.label} <span className="text-amber-500 ml-2">{item.state}</span>
                        </h3>
                    </div>
                </div>
                
                <div className={cn(
                    "p-2 rounded-full border border-zinc-200 dark:border-white/10 transition-all duration-300",
                    isExpanded ? "rotate-180 bg-amber-500 border-amber-500 text-white" : "rotate-0 text-zinc-400"
                )}>
                    <ChevronDown size={18} />
                </div>
            </div>

            <div
                className={cn(
                    "transition-all duration-500 ease-in-out",
                    isExpanded ? "max-h-[1000px] overflow-y-auto opacity-100 border-t border-zinc-100 dark:border-white/5" : "max-h-0 overflow-hidden opacity-0"
                )}
            >
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

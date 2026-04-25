import { ChevronDown } from "lucide-react";
import Image from "next/image";

import type { Cinema } from "@/stores/useCinemaStore";
import type { Location } from "@/stores/useLocationStore";
import type { Movie } from "@/stores/useMovieStore";
import { showtimeDates, showtimeHours } from "./showtime-options";

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
    nowShowingMovies: Movie[];
    selectedCinema?: Cinema;
    onToggleSection: (key: string) => void;
    onSelectValue: (key: string, value: string[]) => void;
};

export function SelectServiceTab({
    select,
    showSelect,
    stateSelect,
    locations,
    nowShowingMovies,
    selectedCinema,
    onToggleSection,
    onSelectValue,
}: SelectServiceTabProps) {
    const hasLocation = Boolean(stateSelect["select-location"]?.[0]);
    const hasMovie = Boolean(stateSelect["select-movie"]?.[0]);
    const selectedShowtimeDate = stateSelect["select-showtime"]?.[0] ?? "";
    const selectedShowtimeTime = stateSelect["select-showtime"]?.[1] ?? "";

    const isUnlocked = (key: string) => {
        if (key === "select-location") {
            return true;
        }

        if (key === "select-movie") {
            return hasLocation;
        }

        if (key === "select-showtime") {
            return hasLocation && hasMovie;
        }

        return false;
    };

    return (
        <>
            {select.map((item) => (
                (() => {
                    const unlocked = isUnlocked(item.key);

                    return (
                        <div
                            key={item.key}
                            className="w-full min-h-14 bg-neutral-100 dark:bg-neutral-900 rounded-xs border-1 border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-center px-4 py-2 font-semibold text-xl"
                        >
                            <div className="flex items-center justify-between">
                                <span>
                                    {item.label} {item.state}
                                </span>
                                <button
                                    onClick={() => onToggleSection(item.key)}
                                    className="rounded-full p-1 bg-neutral-200 dark:bg-neutral-800 border-1 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer shadow-sm"
                                >
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${showSelect[item.key] ? "rotate-180" : "rotate-0"}`}
                                    />
                                </button>
                            </div>

                            <div
                                className={`overflow-y-auto transition-[max-height, margin] duration-300 ease-in-out ${showSelect[item.key] ? "max-h-140 mt-4" : "max-h-0 mt-0"}`}
                            >
                                {!unlocked ? (
                                    null
                                ) : (
                                <div>
                                    <div className="flex flex-wrap gap-4">
                                        {item.key === "select-location"
                                            ? locations.map((location) => {
                                                const isActive = stateSelect["select-location"]?.includes(location.city);

                                                return (
                                                    <button
                                                        key={location.location_id}
                                                        type="button"
                                                        onClick={() => onSelectValue("select-location", [location.city])}
                                                        aria-pressed={isActive}
                                                        className={`px-4 py-2 rounded-sm border-1 cursor-pointer shadow-sm text-sm transition-all duration-200 ${
                                                            isActive
                                                                ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-500/40"
                                                                : "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                                                        }`}
                                                    >
                                                        {location.city}
                                                    </button>
                                                );
                                            })
                                            : null}

                                        {item.key === "select-movie"
                                            ? nowShowingMovies.map((movie) => {
                                                const posterSrc = movie.poster_path
                                                    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                                                    : "/h.png";
                                                const isSelected = stateSelect["select-movie"]?.includes(movie.title);
                                                const hasSelectedMovie = (stateSelect["select-movie"]?.length ?? 0) > 0;
                                                const shouldDeEmphasize = hasSelectedMovie && !isSelected;

                                                return (
                                                    <button
                                                        key={movie.movie_id}
                                                        type="button"
                                                        onClick={() => onSelectValue("select-movie", [movie.title])}
                                                        aria-pressed={isSelected}
                                                        className="flex items-center rounded-sm cursor-pointer shadow-sm mt-2"
                                                    >
                                                        <Image
                                                            src={posterSrc}
                                                            alt={movie.title}
                                                            width={500}
                                                            height={500}
                                                            className={`w-40 h-64 rounded-sm border-1 border-neutral-300 dark:border-neutral-700 shrink-0 transition-all duration-300 ease-out ${
                                                                isSelected
                                                                    ? "scale-105 grayscale-0 blur-0"
                                                                    : shouldDeEmphasize
                                                                    ? "scale-95 grayscale opacity-70"
                                                                    : "scale-100 grayscale-0 blur-0"
                                                            }`}
                                                        />
                                                    </button>
                                                );
                                            })
                                            : null}

                                        {item.key === "select-showtime" ? (
                                            <div className="flex flex-col gap-4 mb-2">
                                                <div className="flex flex-wrap gap-5 items-start">
                                                    {showtimeDates.map((date) => (
                                                        <button
                                                            key={date.value}
                                                            type="button"
                                                            onClick={() => onSelectValue("select-showtime", [date.value, selectedShowtimeTime])}
                                                            aria-pressed={selectedShowtimeDate === date.value}
                                                            className={`flex flex-col gap-1 items-center justify-center border-1 rounded-sm w-24 h-14 p-2 cursor-pointer shadow-sm transition-all duration-200 ${
                                                                selectedShowtimeDate === date.value
                                                                    ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-500/40"
                                                                    : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                                                            }`}
                                                        >
                                                            <p className="text-base font-semibold">{date.dayLabel}</p>
                                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{date.dateLabel}</p>
                                                        </button>
                                                    ))}
                                                </div>

                                                <p className="text-base font-semibold">
                                                    {selectedCinema
                                                        ? `${selectedCinema.name}`
                                                        : stateSelect["select-location"] && stateSelect["select-location"].length > 0
                                                        ? stateSelect["select-location"][0]
                                                        : ""}
                                                </p>

                                                <div className="flex flex-wrap gap-5 items-start">
                                                    {showtimeHours.map((time) => (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            onClick={() => onSelectValue("select-showtime", [selectedShowtimeDate, time])}
                                                            aria-pressed={selectedShowtimeTime === time}
                                                            className={`flex flex-col gap-2 items-center justify-center border-1 rounded-sm px-4 py-2 cursor-pointer shadow-sm transition-all duration-200 ${
                                                                selectedShowtimeTime === time
                                                                    ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-500/40"
                                                                    : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 hover:dark:bg-neutral-700"
                                                            }`}
                                                        >
                                                            <p className="text-base font-light">{time}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    );
                })()
            ))}
        </>
    );
}

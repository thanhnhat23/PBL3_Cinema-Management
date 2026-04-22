"use client"

import { Tabs, Tab, Divider } from "@heroui/react";
import { useState, useEffect } from "react";
import { Popcorn, Armchair, Clapperboard, WalletCards, BadgeCheck, ChevronDown } from "lucide-react"; 
import Image from 'next/image';
import { useLocationStore } from '@/stores/useLocationStore';
import { useCinemaStore } from '@/stores/useCinemaStore';
import { useMovieStore } from '@/stores/useMovieStore';

export default function BookingPage() {
    const [showSelect, setShowSelect] = useState<Record<string, boolean>>({});
    const [stateSelect, setStateSelect] = useState<Record<string, string[]>>({});
    const { locations, fetchAllLocations } = useLocationStore();
    const { cinemas, fetchAllCinemas } = useCinemaStore();
    const { movies, fetchAllMovies } = useMovieStore();

    const nowShowingMovies = movies.filter((movie) => movie.status === 0);
    const selectedLocation = locations.find((location) => stateSelect["select-location"]?.includes(location.city));
    const selectedCinema = cinemas.find((cinema) => cinema.location_id === selectedLocation?.location_id);

    useEffect(() => {
        fetchAllLocations();
        fetchAllCinemas();
        fetchAllMovies();
    }, [fetchAllLocations, fetchAllCinemas, fetchAllMovies]);

    const steps = [
        {
            key: "select-service",
            label: "Phim",
            icon: <Clapperboard size={18} />,
            tab: ""
        },
        {
            key: "select-seat",
            label: "Ghế",
            icon: <Armchair size={18} />
        },
        {
            key: "select-food",
            label: "Đồ ăn",
            icon: <Popcorn size={18} />
        },
        {
            key: "payment",
            label: "Thanh toán",
            icon: <WalletCards size={18} />
        },
        {
            key: "confirmation",
            label: "Xác nhận",
            icon: <BadgeCheck size={18} />
        }
    ]

    const handleShowSelect = (key: string) => {
        setShowSelect((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    const handleSelectState = (key: string, value: string[]) => {
        setStateSelect((prev) => ({
            ...prev,
            [key]: value,
        }));

        setShowSelect((prev) => ({
            ...prev,
            [key]: false,
        }));
    }

    const select = [
        {
            key: "select-location",
            label: "Chọn rạp",
            state: stateSelect["select-location"] ? `- ${stateSelect["select-location"]}` : ""
        },
        {
            key: "select-movie",
            label: "Chọn phim",
            state: stateSelect["select-movie"] ? `- ${stateSelect["select-movie"]}` : ""
        },
        {
            key: "select-showtime",
            label: "Chọn suất chiếu",
            state: stateSelect["select-showtime"] ? `- ${stateSelect["select-showtime"]}` : ""
        }
    ]

    return (
        <div className="min-h-[62.5vh] flex flex-col">
            <div className="flex justify-center items-center my-2 bg-neutral-100 dark:bg-neutral-900 md:py-5 border-1 border-neutral-200 dark:border-neutral-800 shadow-sm">
                <Tabs items={steps} variant="underlined" disabledKeys={["select-seat", "select-food", "payment", "confirmation"]}>
                    {(item) => (
                        <Tab 
                            key={item.key} 
                            title={
                                <div className="flex gap-2 items-center justify-center">
                                    <span className="md:block hidden">{item.icon}</span>
                                    <span className="font-medium tracking-wide md:text-base text-xs">{item.label}</span>
                                </div>
                            } 
                        />
                    )}
                </Tabs>
            </div>

            <div className="flex md:flex-row flex-col gap-4 md:w-[72%] w-full h-full px-4 md:my-16 my-8 mx-auto">
                <div className="md:w-3/4 w-full flex flex-col gap-8 items-center">
                    {select.map((item) => (
                        <div key={item.key} className="w-full min-h-14 bg-neutral-100 dark:bg-neutral-900 rounded-xs border-1 border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-center px-4 py-2 font-semibold text-xl">
                            <div className="flex items-center justify-between">
                                <span>{item.label} {item.state}</span>
                                <button onClick={() => handleShowSelect(item.key)} className="rounded-full p-1 bg-neutral-200 dark:bg-neutral-800 border-1 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer shadow-sm">
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${showSelect[item.key] ? "rotate-180" : "rotate-0"}`}
                                    />
                                </button>
                            </div>

                            <div
                                className={`overflow-y-auto transition-[max-height, margin] duration-300 ease-in-out ${showSelect[item.key] ? "max-h-140 mt-4" : "max-h-0 mt-0"}`}
                            >
                                <div>
                                    <div className="flex flex-wrap gap-4">
                                        {item.key === "select-location" ? (
                                            locations.map((location) => (
                                                (() => {
                                                    const isActive = stateSelect["select-location"]?.includes(location.city);

                                                    return (
                                                        <button
                                                            key={location.location_id}
                                                            type="button"
                                                            onClick={() => handleSelectState("select-location", [location.city])}
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
                                                })()
                                            ))
                                        ) : null}

                                        {item.key === "select-movie" ? (
                                            nowShowingMovies.map((movie) => (
                                                (() => {
                                                    const posterSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : "/h.png";
                                                    const isSelected = stateSelect["select-movie"]?.includes(movie.title);
                                                    const hasSelectedMovie = Boolean(stateSelect["select-movie"]);
                                                    const shouldDeEmphasize = hasSelectedMovie && !isSelected;

                                                    return (
                                                        <button
                                                            key={movie.movie_id}
                                                            type="button"
                                                            onClick={() => handleSelectState("select-movie", [movie.title])}
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
                                                })()
                                            ))
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:w-1/4 w-full flex flex-col items-start bg-neutral-100 dark:bg-neutral-900 rounded-xs border-1 border-neutral-200 dark:border-neutral-800 shadow-sm self-start">
                    <div className="bg-neutral-500 h-2 w-full rounded-t-xs" />

                    <div className="flex gap-4 items-start m-4">
                        <Image
                            src={stateSelect["select-movie"] && stateSelect["select-movie"].length > 0 ? `https://image.tmdb.org/t/p/w185${movies.find((movie) => movie.title === stateSelect["select-movie"]![0])?.poster_path}` : "/h.png"}
                            alt="Movie Poster"
                            width={120}
                            height={200}
                            className="border-1 border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm"
                        />

                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                {stateSelect["select-movie"] && stateSelect["select-movie"].length > 0 ? stateSelect["select-movie"]![0] : ""}
                            </p>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {selectedCinema ? `${selectedCinema.name}` : stateSelect["select-location"] && stateSelect["select-location"].length > 0 ? stateSelect["select-location"]![0] : ""}
                            </p>
                        </div>
                    </div>

                    <Divider />

                    <div className="flex justify-between w-full p-4">
                        <span>Tổng cộng: </span>
                        <span className="font-bold">0vnđ</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
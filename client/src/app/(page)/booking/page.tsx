"use client"

import { Tabs, Tab, Divider } from "@heroui/react";
import { useState, useEffect } from "react";
import { Popcorn, Armchair, Clapperboard, WalletCards, BadgeCheck } from "lucide-react";
import Image from 'next/image';
import { useLocationStore } from '@/stores/useLocationStore';
import { useCinemaStore } from '@/stores/useCinemaStore';
import { useMovieStore } from '@/stores/useMovieStore';
import { SelectServiceTab } from '@/components/layout/SelectTab/SelectServiceTab';
import { SelectSeatTab } from '@/components/layout/SelectTab/SelectSeatTab';

export default function BookingPage() {
    const [showSelect, setShowSelect] = useState<Record<string, boolean>>({});
    const [stateSelect, setStateSelect] = useState<Record<string, string[]>>({});
    const [selectedStep, setSelectedStep] = useState<string>("select-service");
    const [maxUnlockedStepIndex, setMaxUnlockedStepIndex] = useState<number>(0);
    const { locations, fetchAllLocations } = useLocationStore();
    const { cinemas, fetchAllCinemas } = useCinemaStore();
    const { movies, fetchAllMovies } = useMovieStore();

    const nowShowingMovies = movies.filter((movie) => movie.status === 0);
    const selectedLocation = locations.find((location) => stateSelect["select-location"]?.includes(location.city));
    const selectedCinema = cinemas.find((cinema) => cinema.location_id === selectedLocation?.location_id);
    const selectedShowtimeDate = stateSelect["select-showtime"]?.[0] ?? "";
    const selectedShowtimeTime = stateSelect["select-showtime"]?.[1] ?? "";

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

    const getNextSelectKey = (key: string) => {
        if (key === "select-location") {
            return "select-movie";
        }

        if (key === "select-movie") {
            return "select-showtime";
        }

        return null;
    }

    const handleSelectState = (key: string, value: string[]) => {
        const isCompletedSelection = key === "select-showtime"
            ? Boolean(value[0] && value[1])
            : Boolean(value[0]);

        setStateSelect((prev) => {
            const nextState = {
                ...prev,
                [key]: value,
            };

            if (key === "select-location") {
                nextState["select-movie"] = [];
                nextState["select-showtime"] = [];
                nextState["select-seat"] = [];
            }

            if (key === "select-movie") {
                nextState["select-showtime"] = [];
                nextState["select-seat"] = [];
            }

            return nextState;
        });

        setShowSelect((prev) => ({
            ...prev,
            [key]: key === "select-showtime" ? !isCompletedSelection : false,
            ...(isCompletedSelection
                ? (() => {
                    const nextKey = getNextSelectKey(key);
                    return nextKey ? { [nextKey]: true } : {};
                })()
                : {}),
        }));
    }

    const select = [
        {
            key: "select-location",
            label: "Chọn rạp",
            state: stateSelect["select-location"]?.[0] ? `- ${stateSelect["select-location"][0]}` : ""
        },
        {
            key: "select-movie",
            label: "Chọn phim",
            state: stateSelect["select-movie"]?.[0] ? `- ${stateSelect["select-movie"][0]}` : ""
        },
        {
            key: "select-showtime",
            label: "Chọn suất chiếu",
            state: selectedShowtimeDate || selectedShowtimeTime
                ? `- ${[selectedShowtimeDate, selectedShowtimeTime].filter(Boolean).join(" | ")}`
                : ""
        }
    ]

    const currentStepIndex = Math.max(steps.findIndex((step) => step.key === selectedStep), 0);
    const disabledKeys = steps.filter((_, index) => index > maxUnlockedStepIndex).map((step) => step.key);
    const hasSelectedLocation = Boolean(stateSelect["select-location"]?.[0]);
    const hasSelectedMovie = Boolean(stateSelect["select-movie"]?.[0]);
    const hasSelectedShowtime = Boolean(selectedShowtimeDate && selectedShowtimeTime);
    const hasSelectedSeat = (stateSelect["select-seat"]?.length ?? 0) > 0;

    const canGoNext = (() => {
        if (selectedStep === "select-service") {
            return hasSelectedLocation && hasSelectedMovie && hasSelectedShowtime;
        }

        if (selectedStep === "select-seat") {
            return hasSelectedSeat;
        }

        return true;
    })();

    const handleStepChange = (key: string) => {
        const nextIndex = steps.findIndex((step) => step.key === key);
        if (nextIndex === -1 || nextIndex > maxUnlockedStepIndex) {
            return;
        }

        setSelectedStep(key);
    }

    const handleNextStep = () => {
        if (!canGoNext) {
            return;
        }

        if (currentStepIndex < steps.length - 1) {
            const nextStepIndex = currentStepIndex + 1;
            setSelectedStep(steps[nextStepIndex].key);
            setMaxUnlockedStepIndex((prev) => Math.max(prev, nextStepIndex));
        }
    }

    const handlePreviousStep = () => {
        if (currentStepIndex > 0) {
            setSelectedStep(steps[currentStepIndex - 1].key);
        }
    }

    return (
        <div className="min-h-[62.5vh] flex flex-col">
            <div className="flex justify-center items-center my-2 bg-neutral-100 dark:bg-neutral-900 md:py-5 border-1 border-neutral-200 dark:border-neutral-800 shadow-sm">
                <Tabs
                    items={steps}
                    variant="underlined"
                    selectedKey={selectedStep}
                    onSelectionChange={(key) => handleStepChange(String(key))}
                    disabledKeys={disabledKeys}
                >
                    {(item) => (
                        <Tab 
                            key={item.key} 
                            title={
                                <div className="flex gap-2 items-center justify-center">
                                    <span className="md:block hidden">{item.icon}</span>
                                    <span className="font-medium tracking-wide md:text-base text-xs">{item.label}</span>
                                </div>
                            } 
                            className="pointer-events-none"
                        />
                    )}
                </Tabs>
            </div>

            <div className="flex md:flex-row flex-col gap-4 md:w-[72%] w-full h-full px-4 md:my-16 my-8 mx-auto">
                <div className="md:w-3/4 w-full flex flex-col gap-8 items-center">
                    {selectedStep === "select-service" ? (
                        <SelectServiceTab
                            select={select}
                            showSelect={showSelect}
                            stateSelect={stateSelect}
                            locations={locations}
                            nowShowingMovies={nowShowingMovies}
                            selectedCinema={selectedCinema}
                            onToggleSection={handleShowSelect}
                            onSelectValue={handleSelectState}
                        />
                    ) : selectedStep === "select-seat" ? (
                        <SelectSeatTab
                            selectedSeats={stateSelect["select-seat"] ?? []}
                            selectedShowtime={selectedShowtimeTime}
                            onSelectSeats={(seats) => handleSelectState("select-seat", seats)}
                            onSelectShowtime={(time) => handleSelectState("select-showtime", [selectedShowtimeDate, time])}
                        />
                    ) : (
                        <div className="w-full min-h-14 bg-neutral-100 dark:bg-neutral-900 rounded-xs border-1 border-neutral-200 dark:border-neutral-800 shadow-sm px-4 py-6">
                            <p className="font-semibold text-xl">{steps[currentStepIndex].label}</p>
                        </div>
                    )}
                </div>

               <div className="md:w-1/4 w-full flex flex-col items-startself-start">
                    <div className="w-full flex flex-col bg-neutral-100 dark:bg-neutral-900 rounded-xs border-1 border-neutral-200 dark:border-neutral-800 shadow-sm ">
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
                                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                    {stateSelect["select-movie"] && stateSelect["select-movie"].length > 0 ? stateSelect["select-movie"]![0] : ""}
                                </p>

                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {stateSelect["select-location"] && stateSelect["select-location"].length > 0 ? stateSelect["select-location"]![0] : ""}
                                </p>

                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {[selectedShowtimeDate, selectedShowtimeTime].filter(Boolean).join(" | ")}
                                </p>

                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {stateSelect["select-seat"] && stateSelect["select-seat"].length > 0
                                        ? `Ghế: ${stateSelect["select-seat"].join(", ")}`
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <Divider />

                        <div className="flex justify-between w-full p-4">
                            <span>Tổng cộng: </span>
                            <span className="font-bold">0 vnđ</span>
                        </div>
                    </div> 

                    <div className="flex gap-4 mt-8 justify-end">
                        <button
                            type="button"
                            onClick={handlePreviousStep}
                            disabled={currentStepIndex === 0}
                            className="px-4 py-2 rounded-sm border-1 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Quay lại
                        </button>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            disabled={currentStepIndex === steps.length - 1 || !canGoNext}
                            className="px-4 py-2 rounded-sm bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 border-1 border-neutral-900 dark:border-neutral-100 hover:bg-neutral-700 dark:hover:bg-neutral-300 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div> 
            </div>
        </div>
    )
}
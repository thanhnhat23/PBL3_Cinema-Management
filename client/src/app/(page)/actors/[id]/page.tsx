'use client'

import { useActorStore } from "@/stores/useActorStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { CardMovie } from "@/components/layout/cardMovie";
import CardSkeleton from "@/components/skeletons/cardMovie";
import { SparklesText } from "@/components/ui/texts/sparkles-text";
import { UserRound } from "@/components/icons/user-round";
import { Chip, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { CalendarDays, MapPin, VenusAndMars, CircleEllipsis, House, UserCheck } from 'lucide-react';
import Image from "next/image";
import DetailPageSkeleton from "@/components/skeletons/detailPage";

export default function ActorDetailPage() {
    const { 
        selectedActor, 
        movieWithActors,
        characterWithActors, 
        isFetchingActorDetails,
        fetchActorById, 
        fetchMovieWithActors,
        fetchCharacterWithActors
    } = useActorStore();

    const { id } = useParams();
    const actorId = Number(id);

    useEffect(() => {
        fetchActorById(actorId);
        fetchMovieWithActors(actorId);
        fetchCharacterWithActors(actorId);
    }, [fetchActorById, fetchMovieWithActors, fetchCharacterWithActors, actorId]);

    const colorChip = ["success", "warning", "danger"];
    const textColor = ["text-green-100", "text-yellow-100", "text-red-100"];

    if (isFetchingActorDetails || !selectedActor) {
        return <DetailPageSkeleton />;
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center p-4 md:p-8">
            <Image 
                src="https://i.pinimg.com/originals/f8/13/28/f8132830a83552794411ece15fa15390.gif"
                alt="Loading"
                width={1000}
                height={1000}
                className="absolute inset-0 top-0 w-full h-48 md:h-105 object-cover object-center z-0 border-b border-gray-500/20"
            />

            {/* Info actor Overlay */}
            <div className="flex gap-4 items-center w-full pt-24 md:px-8 md:pt-56 z-10 md:w-[72%] mx-auto cursor-default">
                <Image
                    src={selectedActor?.profile_path ? `https://image.tmdb.org/t/p/original${selectedActor.profile_path}` : "/h.png"}
                    alt="Actor Profile"
                    width={400}
                    height={600}
                    className="w-36 h-56 md:w-64 md:h-96 object-cover rounded-md border border-gray-500/20 shadow-md"
                />

                <div className="flex flex-col gap-4 justify-end p-2 h-56 md:h-96 w-full">
                    
                    <div className="mt-auto">
                        <div className="hidden md:flex items-center gap-2 text-sm md:text-base text-gray-500/80 mb-10">
                            <Breadcrumbs size="lg">
                                <BreadcrumbItem href="/" startContent={<House size={18}/>}>
                                    Home
                                </BreadcrumbItem>

                                <BreadcrumbItem href="/actors" startContent={<UserRound size={18} />}>
                                    Diễn viên
                                </BreadcrumbItem>

                                <BreadcrumbItem startContent={<UserCheck size={18} />}>
                                    {selectedActor?.name}
                                </BreadcrumbItem>
                            </Breadcrumbs>
                        </div>

                        <div className="flex items-center justify-center gap-2 md:gap-4 font-bold mb-2 md:mb-4">
                            <UserRound animateOnHover className="size-5 md:size-12" />

                            <SparklesText className="text-lg md:text-6xl text-center">
                                {selectedActor?.name}
                            </SparklesText>
                        </div>

                        <hr />

                        <div className="flex flex-col md:flex-row mt-2 gap-2 md:gap-16 justify-center md:items-center">
                            <div className="flex gap-2">
                                <CalendarDays className="size-4 md:size-5" />
                                
                                <p className="text-xs md:text-base">
                                    <span className="font-semibold">Birthday:</span> {selectedActor?.birthday ? new Date(selectedActor?.birthday).toLocaleDateString("vi-VN") : "N/A"}
                                </p>
                            </div>

                            <span className="hidden md:block w-px md:h-8 bg-black dark:bg-gray-500/20"></span>

                            <div className="flex gap-2">
                                <MapPin className="size-4 md:size-5" />

                                <p className="text-xs md:text-base">
                                    {selectedActor?.place_of_birth || "N/A"}
                                </p>
                            </div>

                            <span className="hidden md:block w-px md:h-8 bg-black dark:bg-gray-500/20"></span>

                            <div className="flex gap-2">
                                <VenusAndMars className="size-4 md:size-5" />

                                <p className="text-xs md:text-base">
                                    <span className="font-semibold">Gender:</span> {selectedActor?.gender === 1 ? "Female" : selectedActor?.gender === 2 ? "Male" : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Character with this actor */}
            <div className="w-full md:w-[72%] mt-12 cursor-default">
                <div className="flex gap-2 w-full items-center justify-start mb-4">
                    <span className="w-1 h-5 md:h-8 bg-black dark:bg-white"></span>
                    <h1 className="text-xl md:text-3xl font-bold">Được biết đến với các vai diễn</h1>
                </div>
                
                <div className="flex gap-2 md:gap-4 pt-2 items-center">
                    {characterWithActors.length === 0 ? (
                        <p className="text-sm md:text-base">Không có vai diễn nào được tìm thấy.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {characterWithActors.map((character, index) => (
                                <Chip
                                    key={index}
                                    color={colorChip[index % colorChip.length] as "success" | "warning" | "danger"}
                                    variant="shadow"
                                    radius="sm"
                                    className={`text-base md:text-lg p-4 ${textColor[index % textColor.length]}`}
                                >
                                    {character?.char_name || "N/A"}
                                </Chip>
                            ))}

                            <Chip
                                isDisabled
                                color="primary"
                                variant="shadow"
                                radius="sm"
                                className="text-base md:text-lg p-4"
                            >
                                <CircleEllipsis />
                            </Chip>
                        </div>
                    )}
                </div>
            </div>

            {/* Movies with this actor */}
            <div className="w-full md:w-[72%] mt-12">
                <div className="flex gap-2 w-full items-center justify-start mb-4 cursor-default">
                    <span className="w-1 h-5 md:h-8 bg-black dark:bg-white"></span>
                    <h1 className="text-xl md:text-3xl font-bold">Phim đã tham gia</h1>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
                    {movieWithActors.length === 0 ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))
                    ) : (
                        movieWithActors
                            .filter((mv) => mv.Movie != null)
                            .map((mv, index) => (
                                <CardMovie 
                                    key={index} 
                                    movie={mv.Movie!} 
                                    index={index}
                                />
                            ))
                    )}
                </div>
            </div>

            {/* Biography */}
            <div className="w-full md:w-[72%] mt-12 cursor-default">
                <div className="flex gap-2 w-full items-center justify-start mb-4">
                    <span className="w-1 h-5 md:h-8 bg-black dark:bg-white"></span>
                    <h1 className="text-xl md:text-3xl font-bold">Tiểu sử</h1>
                </div>
                
                <div className="bg-gray-200/80 dark:bg-gray-500/30 rounded-md p-4 md:p-8">
                    <div className="text-sm md:text-base whitespace-pre-wrap">
                        {selectedActor?.biography || "Hiện chưa có tiểu sử cho diễn viên này. Chúng tôi sẽ cập nhật sớm nhất có thể."}
                    </div>
                </div>
            </div>
        </div>
    );
}
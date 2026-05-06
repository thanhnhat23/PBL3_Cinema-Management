'use client'

import { useActorStore } from "@/stores/useActorStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CardMovie } from "@/components/layout/cardMovie";
import CardSkeleton from "@/components/skeletons/cardMovie";
import { CalendarDays, MapPin, VenusAndMars, UserCheck, Award, Film } from 'lucide-react';
import Image from "next/image"; 
import DetailPageSkeleton from "@/components/skeletons/detailPage";
import { useTranslation } from "react-i18next";
import { BlurFade } from "@/components/ui/effects/blur-fade";

export default function ActorDetailPage() {
    const { t, i18n } = useTranslation();
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

    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        fetchActorById(actorId);
        fetchMovieWithActors(actorId);
        fetchCharacterWithActors(actorId);
    }, [fetchActorById, fetchMovieWithActors, fetchCharacterWithActors, actorId]);

    const profileSrc = imageError
        ? "/h.png"
        : selectedActor?.profile_path
        ? `https://image.tmdb.org/t/p/original${selectedActor.profile_path}`
        : "/h.png";

    if (isFetchingActorDetails || !selectedActor) {
        return <DetailPageSkeleton />;
    }

    const backdropSrc = selectedActor?.profile_path ? `https://image.tmdb.org/t/p/original${selectedActor.profile_path}` : "https://i.pinimg.com/originals/f8/13/28/f8132830a83552794411ece15fa15390.gif";

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Cinematic Immersive Header */}
            <div className="relative w-full h-[70vh] md:h-[65vh] overflow-hidden">
                <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 z-10 bg-linear-to-r from-background via-transparent to-background dark:from-background/80 dark:via-transparent dark:to-background/80" />
                <Image 
                    src={backdropSrc}
                    alt="Actor Background"
                    fill
                    priority
                    unoptimized={!selectedActor?.profile_path}
                    className="object-cover object-center scale-105 blur-sm opacity-40 grayscale"
                />
                
                {/* Floating Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 md:px-0 md:w-[85%] mx-auto pb-12 md:pb-20 pt-32">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        {/* High-End Portrait */}
                        <BlurFade delay={0.1}>
                            <div className="relative group mx-auto md:mx-0">
                                <div className="absolute -inset-1 bg-linear-to-r from-fuchsia-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                                <Image
                                    src={profileSrc || "/h.png"}
                                    alt={selectedActor.name}
                                    width={280}
                                    height={420}
                                    onError={() => setImageError(true)}
                                    className="relative object-cover rounded-2xl border border-white/10 shadow-2xl w-45 md:w-70 h-auto"
                                />
                            </div>
                        </BlurFade>

                        <div className="flex-1 flex flex-col gap-6">
                            <BlurFade delay={0.2}>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/10 backdrop-blur-md border border-zinc-200 dark:border-white/20 text-[10px] font-black text-zinc-500 dark:text-white/80 uppercase tracking-widest">
                                        {t('actors.professional_actor')}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-fuchsia-500/20 backdrop-blur-md border border-fuchsia-500/30 text-[10px] font-black text-fuchsia-300 uppercase tracking-widest">
                                        {t('actors.cinema_star')}
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase drop-shadow-2xl text-center md:text-left">
                                    {selectedActor?.name}
                                </h1>
                            </BlurFade>

                            <BlurFade delay={0.3}>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-zinc-600 dark:text-white/80 font-bold uppercase text-[10px] md:text-xs tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={16} className="text-fuchsia-500" />
                                        <span>{t('actors.birthday')}: {selectedActor?.birthday ? new Date(selectedActor.birthday).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'ja-JP') : "N/A"}</span>
                                    </div>
                                    <div className="md:w-1.5 md:h-1.5 w-1 h-1 rounded-full bg-zinc-200 dark:bg-white/20" />
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-fuchsia-500" />
                                        <span className="truncate max-w-37.5 md:max-w-none">{selectedActor?.place_of_birth || "N/A"}</span>
                                    </div>
                                    <div className="md:w-1.5 md:h-1.5 w-1 h-1 rounded-full bg-zinc-200 dark:bg-white/20" />
                                    <div className="flex items-center gap-2">
                                        <VenusAndMars size={16} className="text-fuchsia-500" />
                                        <span>{t('actors.gender')}: {selectedActor?.gender === 1 ? t('actors.gender_female') : selectedActor?.gender === 2 ? t('actors.gender_male') : t('actors.gender_other')}</span>
                                    </div>
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="md:w-[85%] mx-auto px-4 md:px-0 md:-mt-10 mt-6 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Column: Biography & Known For */}
                    <div className="lg:col-span-2 flex flex-col gap-8 md:gap-12">
                        {/* Biography Card */}
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 md:h-8 bg-fuchsia-500 rounded-full" />
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">{t('actors.biography')}</h2>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                {selectedActor?.biography || t('actors.no_biography')}
                            </p>
                        </div>

                        {/* Known Roles Card */}
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 md:h-8 bg-purple-500 rounded-full" />
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">{t('actors.known_for')}</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {characterWithActors.length === 0 ? (
                                    <p className="text-zinc-500 italic">{t('actors.no_character')}</p>
                                ) : (
                                    characterWithActors.map((character, index) => (
                                        <div key={index} className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 flex items-center gap-1 transition-all hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 group cursor-default">
                                            <Award size={16} className="text-fuchsia-500 group-hover:scale-125 transition-transform" />
                                            <span className="text-sm font-bold tracking-tight">{character?.char_name || "N/A"}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Fast Facts & Stats */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 md:h-8 bg-amber-500 rounded-full" />
                                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">{t('actors.fast_facts')}</h2>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-white/5">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('actors.movie_count')}</span>
                                    <div className="flex items-center gap-2">
                                        <Film size={14} className="text-fuchsia-500" />
                                        <span className="text-sm font-bold">{movieWithActors.length} {t('actors.works')}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('actors.character_count')}</span>
                                    <span className="text-sm font-bold">{characterWithActors.length} {t('actors.characters')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Tags */}
                        <div className="bg-linear-to-br from-fuchsia-600/10 to-purple-600/10 backdrop-blur-2xl rounded-sm p-8 shadow-xl border border-fuchsia-500/20">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-500 mb-4">{t('actors.professional_status')}</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                    <UserCheck size={18} className="text-fuchsia-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">{t('actors.official_collaboration')}</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">
                                    {t('actors.collaboration_desc', { count: movieWithActors.length })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filmography Section */}
                <div className="mt-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 md:h-8 bg-amber-500 rounded-full" />
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{t('actors.filmography')}</h2>
                        </div>
                        <div className="hidden md:flex gap-2">
                             <div className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {t('actors.movies_count_label', { count: movieWithActors.length })}
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {movieWithActors.length === 0 ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <CardSkeleton key={index} />
                            ))
                        ) : (
                            movieWithActors
                                .filter((mv) => mv.Movie != null)
                                .map((mv, index) => (
                                    <BlurFade key={index} delay={index * 0.05}>
                                        <CardMovie 
                                            movie={mv.Movie!} 
                                            index={index}
                                        />
                                    </BlurFade>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
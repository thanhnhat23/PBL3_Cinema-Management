'use client'

import { useActorStore } from "@/stores/useActorStore";
import { useEffect, useState, useMemo } from "react";
import { CardActor } from "@/components/layout/cardActor";
import { Pagination, Input } from "@heroui/react";
import CardActorSkeleton from "@/components/skeletons/cardActor";
import { BlurFade } from "@/components/ui/effects/blur-fade";
import { FiSearch } from "react-icons/fi";

export default function ActorsPage() {
    const { actors, fetchAllActors, isFetchingActors } = useActorStore();
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    
    const filteredActors = useMemo(() => {
        return actors.filter(actor => {
            const matchesSearch = actor.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [actors, searchQuery]);

    const totalPage = Math.ceil(filteredActors.length / 30);

    useEffect(() => {
        fetchAllActors();
    }, [fetchAllActors]);

    const pagedActors = useMemo(() => {
        const startIndex = (page - 1) * 30;
        return filteredActors.slice(startIndex, startIndex + 30);
    }, [filteredActors, page]);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Elegant Header Section */}
            <div className="w-full bg-white dark:bg-zinc-950 py-20 mb-12 border-b border-zinc-100 dark:border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-fuchsia-500/10 via-transparent to-purple-500/10" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                    <BlurFade delay={0.1}>
                        <div className="flex flex-col items-start gap-4">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
                                Star Spotlight
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase drop-shadow-2xl">
                                Những gương mặt <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 to-purple-600">Điện ảnh</span>
                            </h1>
                            <p className="text-zinc-500 font-medium max-w-2xl text-sm md:text-base leading-relaxed">
                                Gặp gỡ những tài năng đã góp phần làm nên sức hút của các tác phẩm điện ảnh. Từ những ngôi sao gạo cội đến những gương mặt mới đầy triển vọng.
                            </p>
                            
                            <div className="w-full max-w-md mt-4">
                                <Input
                                    placeholder="Tìm kiếm diễn viên..."
                                    value={searchQuery}
                                    onValueChange={(val) => {
                                        setSearchQuery(val);
                                        setPage(1);
                                    }}
                                    startContent={<FiSearch className="text-zinc-400" />}
                                    classNames={{
                                        inputWrapper: "bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 h-12 rounded-full backdrop-blur-md focus-within:ring-2 focus-within:ring-fuchsia-500/50 transition-all shadow-lg",
                                        input: "text-sm font-medium",
                                    }}
                                />
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {isFetchingActors ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {Array.from({ length: 30 }).map((_, index) => (
                            <CardActorSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {pagedActors.map((actor, index) => (
                            <BlurFade key={actor.actor_id} delay={index * 0.02} inView>
                                <CardActor actor={actor} index={actor.actor_id} />
                            </BlurFade>
                        ))}
                    </div>
                )}

                <div className="flex justify-center mt-16">
                    <Pagination
                        page={page}
                        total={totalPage}
                        onChange={setPage}
                        classNames={{
                            wrapper: "gap-2",
                            item: "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold",
                            cursor: "bg-fuchsia-600 text-white font-black"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
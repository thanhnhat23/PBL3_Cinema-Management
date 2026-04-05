'use client'

import { useActorStore } from "@/stores/useActorStore";
import { useEffect, useState, useMemo } from "react";
import { CardActor } from "@/components/layout/cardActor";
import { Pagination } from "@heroui/react";
import CardActorSkeleton from "@/components/skeletons/cardActor";

export default function ActorsPage() {
    const { actors, fetchAllActors, isFetchingActors } = useActorStore();
    const [page, setPage] = useState<number>(1);
    const totalPage = Math.ceil(actors.length / 30);

    useEffect(() => {
        fetchAllActors();
    }, [fetchAllActors]);

    const pagedActors = useMemo(() => {
        const startIndex = (page - 1) * 30;
        return actors.slice(startIndex, startIndex + 30);
    }, [actors, page]);

    return (
        <div className="flex flex-col items-center p-4 md:p-8 md:w-[72%] mx-auto gap-4">
            <div className="flex gap-2 w-full items-center justify-start mb-4">
                <span className="w-1 h-8 bg-black dark:bg-white"></span>
                <h1 className="text-2xl md:text-3xl font-bold">Diễn viên</h1>
            </div>

            {isFetchingActors ? (
                <div className="min-h-screen grid grid-cols-2 md:grid-cols-5 gap-8">
                    {Array.from({ length: 30 }).map((_, index) => (
                        <CardActorSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {pagedActors.map((actor) => (
                        <CardActor actor={actor} index={actor.actor_id} key={actor.actor_id} />
                    ))}
                </div>
            )}

            <Pagination
                page={page}
                total={totalPage}
                onChange={setPage}
                classNames={{
                    wrapper: "gap-2 mt-8 justify-center",
                    item: "bg-zinc-200 dark:bg-zinc-600"
                }}
            />
        </div>
    );
}
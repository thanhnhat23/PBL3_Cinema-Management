import { Actor } from "@/stores/useActorStore";
import { Card, CardFooter, Image } from "@heroui/react";
import { useState } from "react";
import Link from 'next/link';

interface DataActorProps {
  actor: Actor;
  index: number;
}

export const CardActor = ({
    actor,
    index,
}: DataActorProps) => {
    const [imgSrc, setImgSrc] = useState(actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.profile_path}` : "/h.png");

    return (
        <Link
            href={`/actors/${actor.actor_id}`}
            key={index}
            className="group"
        >
            <Card radius="sm" className="border-none shadow-2xl transition-all duration-500 hover:scale-[1.05] hover:shadow-fuchsia-500/20 overflow-hidden bg-white dark:bg-zinc-950">
                <div className="relative aspect-3/4 md:aspect-2/3 w-full overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={actor.name}
                        onError={() => setImgSrc("/h.png")}
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 grayscale-20 group-hover:grayscale-0"
                    />
                    
                    {/* Premium Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-900/95 via-zinc-900/40 dark:from-black/95 dark:via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                </div>

                <CardFooter className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-1 backdrop-blur-xl bg-white/80 dark:bg-black/60 border-t border-zinc-200 dark:border-white/10 z-30">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-3 bg-fuchsia-500 rounded-full" />
                        <span className="text-[10px] text-fuchsia-500 dark:text-fuchsia-400 font-black uppercase tracking-[0.2em]">Star Profile</span>
                    </div>
                    <b className="text-zinc-900 dark:text-white text-sm md:text-lg font-black uppercase tracking-tight truncate w-full drop-shadow-lg group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                        {actor.name}
                    </b>
                    <div className="flex items-center gap-2">
                        <p className="text-zinc-600 dark:text-white/60 text-[10px] font-bold uppercase tracking-widest">
                            {actor.birthday ? new Date(actor.birthday).getFullYear() : "Cinema Star"}
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
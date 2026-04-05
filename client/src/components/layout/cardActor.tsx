import { Actor } from "@/stores/useActorStore";
import { Card, CardFooter, CardBody, Image } from "@heroui/react";
import Link from 'next/link';

interface DataActorProps {
  actor: Actor;
  index: number;
}

export const CardActor = ({
    actor,
    index,
}: DataActorProps) => {
    return (
        <Link
            href={`/actors/${actor.actor_id}`}
            key={index}
        >
            <Card isPressable shadow="sm" className="border border-zinc-300 dark:border-zinc-700 rounded-lg">
                <CardBody className="p-0">
                    <Image
                        isZoomed
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.profile_path}` : "/h.png"}
                        alt={actor.name}
                        shadow="sm"
                        radius="none"
                        className="object-cover object-center w-46 h-60 md:h-80 md:w-56"
                    />
                </CardBody>

                <CardFooter className="text-small flex flex-col gap-2">
                    <b className="w-full whitespace-nowrap truncate overflow-hidden">{actor.name}</b>
                    <p className="text-default-500">{actor.birthday ? new Date(actor.birthday).toLocaleDateString("vi-VN") : "Không có thông tin"}</p>
                </CardFooter>
            </Card>
        </Link>
    )
}
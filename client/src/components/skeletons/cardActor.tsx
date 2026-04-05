import { Card, CardFooter, CardBody, Skeleton } from "@heroui/react";
import { Image } from "@heroui/react";

export default function CardActorSkeleton() {
    
    return (
        <>
           <Card isPressable shadow="sm" className="border border-zinc-300 dark:border-zinc-700 rounded-lg">
                <CardBody className="p-0">
                    <Image
                        isZoomed
                        src="https://app.requestly.io/delay/150000/https://heroui.com/images/hero-card-complete.jpeg"
                        alt="Skeleton"
                        shadow="sm"
                        radius="none"
                        className="w-46 h-60 md:h-80 md:w-56"
                    />
                </CardBody>

                <CardFooter className="text-small flex flex-col gap-2">
                    <Skeleton className="rounded-lg">
                        <div className="px-24 py-2 bg-default-300" />
                    </Skeleton>
                    <Skeleton className="rounded-lg">
                        <div className="px-18 py-2 bg-default-300" />
                    </Skeleton>
                </CardFooter>
            </Card>
        </>
    );
};
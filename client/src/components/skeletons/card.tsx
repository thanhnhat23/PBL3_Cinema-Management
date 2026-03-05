import { Card, CardFooter, CardHeader, Skeleton } from "@heroui/react";

export default function CardSkeleton() {
    
    return (
        <>
            <Card radius="md" className="group relative">
                <CardHeader className="absolute z-15 top-1 hidden md:flex items-start! justify-between">
                    <Skeleton className="rounded-2xl">
                        <div className="px-10 py-4 bg-default-300"/>
                    </Skeleton>

                    <Skeleton className="rounded-lg">
                        <div className="px-6 py-4 bg-default-300"/>
                    </Skeleton>
                </CardHeader>

                <Skeleton className="rounded-lg">
                    <div className="w-52 h-72 md:w-72 md:h-110 bg-default-300" />
                </Skeleton>

                <CardFooter className="hidden md:flex absolute bottom-0 z-15 justify-between pointer-events-none md:bg-black/40 md:backdrop-blur-[0.2rem]">
                    <Skeleton className="rounded-lg">
                        <div className="p-4 bg-default-300"/>
                    </Skeleton>

                    <div className="flex flex-col gap-2">
                        <Skeleton className="rounded-lg">
                            <div className="px-18 py-1 rounded-md bg-default-300" />
                        </Skeleton>

                        <Skeleton className="rounded-lg">
                            <div className="px-18 py-1 rounded-md bg-default-300" />
                        </Skeleton>
                    </div>

                    <Skeleton className="rounded-lg">
                        <div className="px-6 py-4 flex items-center justify-center rounded-md bg-default-300" />
                    </Skeleton>
                </CardFooter>
            </Card>
        </>
    );
};
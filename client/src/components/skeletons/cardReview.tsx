import { Card, CardBody, Divider, Skeleton } from "@heroui/react";
import { Image } from "@heroui/react";

export default function CardReviewSkeleton() {
    return (
        <Card>
            <CardBody className="p-4 flex flex-row gap-4 items-start">
                <div className="h-full min-w-36">
                    <Skeleton className="rounded-lg">
                        <div className="w-36 h-56" />
                    </Skeleton>
                </div>

                <div className="flex flex-col gap-2 w-full min-h-46">
                    
                    <Skeleton className="rounded-lg">
                        <div className="py-4 bg-default-300 mb-2" />
                    </Skeleton>

                    <div className="flex md:flex-row flex-col gap-2">
                        <Skeleton className="rounded-lg">
                            <div className="px-14 py-2 bg-default-300" />  
                        </Skeleton>

                        <span className="hidden md:block w-px md:h-5 bg-black dark:bg-gray-500/20"></span>

                        <Skeleton className="rounded-lg">
                            <div className="px-14 py-2 bg-default-300" />  
                        </Skeleton>
                    </div>

                    <Divider orientation="horizontal" />

                    <Skeleton className="rounded-lg">
                        <div className="w-full h-22 bg-default-300" />
                    </Skeleton>

                    <Divider orientation="horizontal" />

                    <div className="flex gap-1">
                        <Skeleton className="rounded-lg">
                            <div className="w-96 h-8 bg-default-300" />  
                        </Skeleton>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
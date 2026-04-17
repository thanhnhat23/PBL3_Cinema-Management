import { Skeleton } from "@heroui/react";

interface DetailPageSkeletonProps {
  className?: string;
}

export default function DetailPageSkeleton({ className }: DetailPageSkeletonProps) {
  return (
    <div className={`min-h-screen w-full md:w-[85%] mx-auto p-4 md:p-6 ${className ?? ""}`}>
      <Skeleton className="rounded-lg">
        <div className="w-full h-52 md:h-140 bg-default-300 rounded-lg" />
      </Skeleton>

      <div className="mt-4 md:mt-6 flex gap-3 md:gap-6 items-start">
        <Skeleton className="rounded-lg shrink-0">
          <div className="w-36 h-56 md:w-64 md:h-96 bg-default-300 rounded-lg" />
        </Skeleton>

        <div className="flex-1 space-y-3 md:space-y-5">
          <Skeleton className="rounded-md">
            <div className="w-2/3 h-7 md:h-11 bg-default-300" />
          </Skeleton>
          <Skeleton className="rounded-md">
            <div className="w-full h-5 md:h-7 bg-default-300" />
          </Skeleton>
          <Skeleton className="rounded-md">
            <div className="w-11/12 h-5 md:h-7 bg-default-300" />
          </Skeleton>
          <Skeleton className="rounded-md">
            <div className="w-1/3 h-10 md:h-12 bg-default-300" />
          </Skeleton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-10">
        <Skeleton className="rounded-lg">
          <div className="w-full h-72 md:h-96 bg-default-300 rounded-lg" />
        </Skeleton>

        <div className="space-y-4">
          <Skeleton className="rounded-lg">
            <div className="w-full h-28 bg-default-300 rounded-lg" />
          </Skeleton>
          <Skeleton className="rounded-lg">
            <div className="w-full h-56 md:h-64 bg-default-300 rounded-lg" />
          </Skeleton>
        </div>
      </div>
    </div>
  );
}

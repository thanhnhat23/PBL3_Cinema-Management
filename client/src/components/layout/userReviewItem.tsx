import { AvatarElement } from "@/components/ui/avatar";
import { Review } from "@/stores/useReviewStore";
import { FaStar } from "react-icons/fa";

interface UserReviewItemProps {
    review: Review;
    index: number;
}

export default function UserReviewItem({ review }: UserReviewItemProps) {
    return (
        <div 
            className="w-full flex flex-col gap-4 p-6 bg-white dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 rounded-xl transition-all hover:bg-zinc-50 dark:hover:bg-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
        >
            {/* Review Header: User Info & Rating */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <AvatarElement 
                        avatar={review.avatar_path} 
                        width="w-12" 
                        height="h-12" 
                        widthDeco="w-16" 
                        translatex="-translate-x-2"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                            {review.username}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                {review.createAt ? new Date(review.createAt).toLocaleDateString("vi-VN") : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar 
                                key={i} 
                                size={14} 
                                className={i < Math.round(review.rating / 2) ? "text-yellow-400" : "text-zinc-200 dark:text-zinc-800"} 
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                        {review.rating.toFixed(1)} / 10
                    </span>
                </div>
            </div>

            {/* Review Content */}
            <div className="relative">
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 italic">
                    &quot;{review.comment}&quot;
                </p>
                <div className="absolute -left-2 top-0 text-3xl text-zinc-200 dark:text-zinc-800 pointer-events-none opacity-50 font-serif">
                    &ldquo;
                </div>
            </div>
        </div>
    );
}

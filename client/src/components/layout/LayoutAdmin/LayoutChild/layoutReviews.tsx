import type { Key } from "react";

import { useCallback, useEffect, useState } from "react";
import {
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
} from "@heroui/react";
import { Ban, EllipsisVertical, Eye, MessageSquare, Star as StarIcon, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { AvatarElement } from "@/components/ui/avatar";
import { useMovieStore } from "@/stores/useMovieStore";
import { useReviewStore, type Review } from "@/stores/useReviewStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { useTranslation } from "react-i18next";

const getReviewColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: t('common.id'), uid: "review_id", sortable: true },
    { name: t('reviews_tab.columns.user'), uid: "username", sortable: true },
    { name: t('reviews_tab.columns.movie'), uid: "movie_id", sortable: true },
    { name: t('reviews_tab.columns.rating'), uid: "rating", sortable: true },
    { name: t('reviews_tab.columns.content'), uid: "comment", sortable: true },
    { name: t('reviews_tab.columns.status'), uid: "isApproved", sortable: true },
    { name: t('reviews_tab.columns.created'), uid: "createAt", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

const statusColorMap: Record<string, "success" | "warning"> = {
    true: "success",
    false: "warning",
};

export default function LayoutReviews() {
    const { t } = useTranslation();
    const { reviews, isFetchingReviews, fetchReviews } = useReviewStore();
    const { movies, fetchAllMovies } = useMovieStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        fetchAllMovies();
    }, [fetchAllMovies]);

    const getMovieTitleById = useCallback((movieId: number) => {
        const movie = movies.find((item) => item.movie_id === movieId);
        return movie?.title ?? `Movie #${movieId}`;
    }, [movies]);

    const renderCell = useCallback((review: Review, columnKey: Key) => {
        const cellValue = review[columnKey as keyof Review];

        switch (columnKey) {
            case "username":
                return (
                    <div className="flex items-center gap-3">
                        <AvatarElement
                            previewSrc={review.avatar_path ? `https://image.tmdb.org/t/p/w185${review.avatar_path}` : undefined}
                            width="w-8"
                            height="h-8"
                            widthDeco="w-11"
                            left="left-1/2"
                            translatex="-translate-x-1/2"
                        />
                        <div className="flex flex-col">
                            <p className="text-bold text-small font-semibold">{review.username}</p>
                            <p className="text-bold text-tiny text-zinc-500">@{review.profile_slug}</p>
                        </div>
                    </div>
                );
            case "rating":
                return (
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-yellow-600 dark:text-yellow-500">{review.rating.toFixed(1)}</span>
                        <StarIcon size={12} className="fill-yellow-500 text-yellow-500" />
                    </div>
                );
            case "comment":
                return <span className="line-clamp-1 max-w-60 text-zinc-600 dark:text-zinc-400 text-sm">{review.comment ?? t('reviews_tab.no_comment')}</span>;
            case "movie_id":
                return <span className="font-medium text-blue-600 dark:text-blue-400">{getMovieTitleById(review.movie_id)}</span>;
            case "isApproved":
                return (
                    <Chip className="capitalize font-bold" color={statusColorMap[String(review.isApproved)]} size="sm" variant="flat">
                        {review.isApproved ? t('reviews_tab.status.approved') : t('reviews_tab.status.pending')}
                    </Chip>
                );
            case "createAt":
                return <span className="text-zinc-500 text-xs">{new Date(String(review.createAt)).toLocaleDateString(t('locale_code'))}</span>;
            case "actions":
                return (
                    <Dropdown classNames={{
                        content: "bg-sidebar shadow-lg border-1 border-zinc-200 dark:border-zinc-800",
                    }}>
                        <DropdownTrigger>
                            <button className="p-2 rounded-sm hover:border-1 hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-sidebar cursor-pointer">
                                <EllipsisVertical size={18} />
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key="view"
                                startContent={<Eye size={18} />}
                                showDivider
                                onPress={() => {
                                    setSelectedReview(review);
                                    onOpen();
                                }}
                            >
                                {t('common.view')}
                            </DropdownItem>

                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [getMovieTitleById, onOpen, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <MessageSquare size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('reviews_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('reviews_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Review>
                columns={getReviewColumns(t)}
                items={reviews}
                isLoading={isFetchingReviews}
                searchPlaceholder={t('reviews_tab.search_placeholder')}
                totalLabel={(count) => t('reviews_tab.total_count', { count })}
                emptyLabel={t('reviews_tab.empty_label')}
                loadingLabel={t('reviews_tab.loading_label')}
                defaultSort={{ column: "createAt", direction: "descending" }}
                rowKey={(item) => `${item.review_id || "review"}-${item.movie_id}-${item.profile_slug}-${item.createAt}`}
                searchBy={(item) => item.username}
                renderCell={renderCell}
                selectionMode="none"
                hideDeleteSelected={true}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {t('reviews_tab.details_title')}
                            </DrawerHeader>

                            <DrawerBody className="p-0">
                                {selectedReview ? (
                                    <div className="flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-950/30">
                                        <div className="p-8 flex flex-col items-center gap-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 shadow-sm">
                                            <AvatarElement
                                                previewSrc={selectedReview.avatar_path ? `https://image.tmdb.org/t/p/w185${selectedReview.avatar_path}` : undefined}
                                                width="w-24"
                                                height="h-24"
                                                widthDeco="w-28"
                                                left="left-1/2"
                                                translatex="-translate-x-1/2"
                                            />
                                            <div className="text-center flex flex-col gap-1">
                                                <h2 className="text-2xl font-bold">{selectedReview.username}</h2>
                                                <p className="text-sm text-zinc-500 font-medium">@{selectedReview.profile_slug}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-500 border-none px-3 py-1 flex gap-1 items-center font-bold">
                                                    {selectedReview.rating.toFixed(1)} / 10
                                                    <StarIcon size={14} className="fill-current" />
                                                </Badge>
                                                <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none px-3 py-1 font-bold">
                                                    ID: {selectedReview.review_id}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col gap-8">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <MessageSquare size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('reviews_tab.movie_label')}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 line-clamp-1">
                                                        {getMovieTitleById(selectedReview.movie_id)}
                                                    </span>
                                                </div>
                                                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Calendar size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('reviews_tab.date_label')}</span>
                                                    </div>
                                                    <span className="text-sm font-bold">
                                                        {new Date(String(selectedReview.createAt)).toLocaleDateString(t('locale_code'))}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('reviews_tab.content_label')}</span>
                                                    <Chip className="capitalize h-6 text-[10px] font-bold" color={statusColorMap[String(selectedReview.isApproved)]} size="sm" variant="flat">
                                                        {selectedReview.isApproved ? t('reviews_tab.status.approved') : t('reviews_tab.status.pending')}
                                                    </Chip>
                                                </div>
                                                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 relative shadow-sm">
                                                    <div className="absolute -top-3 left-6 text-4xl text-zinc-200 dark:text-zinc-800 font-serif leading-none">“</div>
                                                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 italic relative z-10">
                                                        {selectedReview.comment || t('reviews_tab.no_comment')}
                                                    </p>
                                                    <div className="absolute -bottom-6 right-6 text-4xl text-zinc-200 dark:text-zinc-800 font-serif leading-none rotate-180">“</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500 font-medium italic">{t('reviews_tab.no_data')}</div>
                                )}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <button onClick={onClose} className="w-full font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                                    {t('foods_tab.close_details')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

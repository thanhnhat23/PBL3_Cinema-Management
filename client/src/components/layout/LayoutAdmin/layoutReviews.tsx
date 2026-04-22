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
import { Ban, EllipsisVertical, Eye, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { AvatarElement } from "@/components/ui/avatar";
import { useMovieStore } from "@/stores/useMovieStore";
import { useReviewStore, type Review } from "@/stores/useReviewStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";
import { Star } from "@/components/icons/star";

const columns: AdminColumn[] = [
    { name: "ID", uid: "review_id", sortable: true },
    { name: "NGƯỜI DÙNG", uid: "username", sortable: true },
    { name: "PHIM", uid: "movie_id", sortable: true },
    { name: "RATING", uid: "rating", sortable: true },
    { name: "NỘI DUNG", uid: "comment", sortable: true },
    { name: "TRẠNG THÁI", uid: "isApproved", sortable: true },
    { name: "NGÀY TẠO", uid: "createAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, "success" | "warning"> = {
    true: "success",
    false: "warning",
};

export default function LayoutReviews() {
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
                            <p className="text-bold text-small">{review.username}</p>
                            <p className="text-bold text-tiny text-default-400">{review.profile_slug}</p>
                        </div>
                    </div>
                );
            case "rating":
                return <span className="font-semibold">{review.rating.toFixed(1)}</span>;
            case "comment":
                return <span className="line-clamp-1 max-w-60">{review.comment ?? "Không có nội dung"}</span>;
            case "movie_id":
                return <span className="font-medium">{getMovieTitleById(review.movie_id)}</span>;
            case "isApproved":
                return (
                    <Chip className="capitalize" color={statusColorMap[String(review.isApproved)]} size="sm" variant="flat">
                        {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </Chip>
                );
            case "createAt":
                return <span>{new Date(String(review.createAt)).toLocaleDateString("vi-VN")}</span>;
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
                                Xem
                            </DropdownItem>

                            <DropdownItem key="delete" startContent={<Ban size={18} />} className="text-danger" color="danger">
                                Cấm
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [getMovieTitleById, onOpen]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle />
                Dashboard: Quản lí đánh giá
            </h1>

            <DataTableAdmin<Review>
                columns={columns}
                items={reviews}
                isLoading={isFetchingReviews}
                searchPlaceholder="Tìm theo tên người review..."
                addButtonLabel="Thêm review"
                totalLabel={(count) => `Tổng cộng ${count} đánh giá`}
                emptyLabel="Không có đánh giá"
                loadingLabel="Đang tải dữ liệu đánh giá..."
                defaultSort={{ column: "createAt", direction: "descending" }}
                rowKey={(item) => `${item.review_id || "review"}-${item.movie_id}-${item.profile_slug}-${item.createAt}`}
                searchBy={(item) => item.username}
                renderCell={renderCell}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {selectedReview ? `Chi tiết review: ${selectedReview.username}` : "Chi tiết đánh giá"}
                            </DrawerHeader>

                            <DrawerBody>
                                {selectedReview ? (
                                    <div className="flex flex-col gap-3 justify-center items-center">
                                        <AvatarElement
                                            previewSrc={selectedReview.avatar_path ? `https://image.tmdb.org/t/p/w185${selectedReview.avatar_path}` : undefined}
                                            width="w-32"
                                            height="h-32"
                                            widthDeco="w-39"
                                            left="left-1/2"
                                            translatex="-translate-x-1/2"
                                        />

                                        <div className="flex flex-col gap-2 mt-2 w-full">
                                            <p className="font-semibold text-3xl">{selectedReview.username}</p>

                                            <div className="flex gap-2 flex-wrap">
                                                <Badge>
                                                    {selectedReview.review_id}
                                                </Badge>

                                                <Badge variant={"secondary"}>
                                                    {getMovieTitleById(selectedReview.movie_id)}
                                                </Badge>

                                                <Badge variant={"outline"}>
                                                    {selectedReview.rating.toFixed(1)} / 10
                                                    <Star className="text-yellow-400" />
                                                </Badge>
                                            </div>

                                            <Chip className="capitalize" color={statusColorMap[String(selectedReview.isApproved)]} size="sm" variant="flat">
                                                {selectedReview.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                                            </Chip>

                                            <p>
                                                <span className="font-semibold">Ngày tạo:</span>{" "}
                                                {new Date(String(selectedReview.createAt)).toLocaleDateString("vi-VN")}
                                            </p>

                                            {selectedReview.comment ? (
                                                <p>
                                                    <span className="font-semibold">Nội dung:</span>
                                                    <br />
                                                    {selectedReview.comment}
                                                </p>
                                            ) : (
                                                <p>
                                                    <span className="font-semibold">Nội dung:</span>
                                                    <br />
                                                    Không có nội dung
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p>Không có dữ liệu đánh giá.</p>
                                )}
                            </DrawerBody>

                            <DrawerFooter>
                                <button onClick={onClose} className="dark:text-black text-white font-semibold border-1 border-zinc-200 dark:border-neutral-200 rounded-sm px-4 py-2 bg-neutral-800 dark:bg-neutral-100 shadow-[0_0_4px_#ffffff] cursor-pointer">
                                    Đóng
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

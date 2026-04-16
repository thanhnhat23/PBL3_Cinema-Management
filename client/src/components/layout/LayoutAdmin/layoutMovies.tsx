import type { Key } from "react";

import { useCallback, useEffect, useState } from "react";
import { 
    Chip, 
    Dropdown, 
    DropdownItem, 
    DropdownMenu, 
    DropdownTrigger, 
    User,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure
} from "@heroui/react";
import { EllipsisVertical, Eye, PenLine, Trash, Video } from "lucide-react";
import { StarIcon } from "@/components/icons/star";

import { useMovieStore, type Movie } from "@/stores/useMovieStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

const columns: AdminColumn[] = [
    { name: "ID", uid: "movie_id", sortable: true },
    { name: "PHIM", uid: "title", sortable: true },
    { name: "THỜI LƯỢNG", uid: "runtime", sortable: true },
    { name: "ĐIỂM", uid: "vote_average", sortable: true },
    { name: "LƯỢT ĐÁNH GIÁ", uid: "vote_count", sortable: true },
    { name: "NGÀY CHIẾU", uid: "release_date", sortable: true },
    { name: "TRẠNG THÁI", uid: "status", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<Movie["status"], "success" | "warning" | "danger"> = {
    0: "success",
    1: "warning",
    2: "danger",
};

const getPosterSrc = (posterPath?: string | null) => {
    if (!posterPath) return "https://placehold.co/120x180?text=No+Poster";
    if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) return posterPath;
    return `https://image.tmdb.org/t/p/w185${posterPath}`;
};

export default function LayoutMovies() {
    const { movies, isFetchingMovies, fetchAllMovies, getStatusLabel } = useMovieStore();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        fetchAllMovies();
    }, [fetchAllMovies]);

    const renderCell = useCallback((movie: Movie, columnKey: Key) => {
        const cellValue = movie[columnKey as keyof Movie];

        switch (columnKey) {
            case "title":
                return (
                    <User avatarProps={{ radius: "sm", src: getPosterSrc(movie.poster_path) }} name={movie.title}>
                        {movie.title}
                    </User>
                );
            case "runtime":
                return <span>{movie.runtime} phút</span>;
            case "vote_average":
                return <span className="font-semibold">{Number(movie.vote_average ?? 0).toFixed(1)}</span>;
            case "vote_count":
                return <span>{movie.vote_count}</span>;
            case "release_date":
                return <span>{new Date(String(movie.release_date)).toLocaleDateString("vi-VN")}</span>;
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[movie.status]} size="sm" variant="flat">
                        {getStatusLabel(movie.status)}
                    </Chip>
                );
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
                                onPress={() => {
                                    setSelectedMovie(movie);
                                    onOpen();
                                }}
                            >
                                Xem
                            </DropdownItem>

                            <DropdownItem key="edit" startContent={<PenLine size={18} />} showDivider>
                                Sửa
                            </DropdownItem>
                            <DropdownItem key="delete" startContent={<Trash size={18} />}>
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [getStatusLabel, onOpen]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Video />
                Dashboard: Quản lí phim
            </h1>

            <DataTableAdmin<Movie>
                columns={columns}
                items={movies}
                isLoading={isFetchingMovies}
                searchPlaceholder="Tìm theo tên phim..."
                addButtonLabel="Thêm phim"
                totalLabel={(count) => `Tổng cộng ${count} phim`}
                emptyLabel="Không có phim"
                loadingLabel="Đang tải dữ liệu phim..."
                defaultSort={{ column: "release_date", direction: "descending" }}
                rowKey={(item) => item.movie_id}
                searchBy={(item) => item.title}
                renderCell={renderCell}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {selectedMovie ? `Chi tiết: ${selectedMovie.title}` : "Chi tiết phim"}
                            </DrawerHeader>
                            
                            <DrawerBody>
                                {selectedMovie ? (
                                    <div className="flex flex-col gap-3 justify-center items-center">
                                        <Image 
                                            src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
                                            alt={selectedMovie.title} 
                                            width={300} 
                                            height={600}
                                            className="w-56 h-96 rounded-sm shadow-sm border-1 border-zinc-800" 
                                        />

                                        <div className="flex flex-col gap-2 mt-2">
                                            <p className="font-semibold text-3xl">{selectedMovie.title}</p>

                                            <div className="flex gap-2">
                                                <Badge>
                                                    {selectedMovie.movie_id}
                                                </Badge>

                                                <Badge variant={"secondary"}>
                                                    {getStatusLabel(selectedMovie.status)}
                                                </Badge>

                                                <Badge className="flex gap-1 items-center justify-center" variant={"outline"}>
                                                    {Number(selectedMovie.vote_average ?? 0).toFixed(1)}
                                                    <StarIcon className="text-yellow-500" />
                                                </Badge>
                                            </div>

                                            <p>
                                                <span className="font-semibold">Thời lượng:</span> {" "}
                                                {selectedMovie.runtime} phút
                                            </p>

                                            <p>
                                                <span className="font-semibold">Lượt đánh giá:</span> {" "}
                                                {selectedMovie.vote_count}
                                            </p>

                                            <p>
                                                <span className="font-semibold">Ngày chiếu:</span> {" "}
                                                {new Date(String(selectedMovie.release_date)).toLocaleDateString("vi-VN")}
                                            </p>

                                            {selectedMovie.overview ? (
                                                <p>
                                                    <span className="font-semibold">Mô tả:</span> 
                                                    <br />
                                                    {selectedMovie.overview}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : (
                                    <p>Không có dữ liệu phim.</p>
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
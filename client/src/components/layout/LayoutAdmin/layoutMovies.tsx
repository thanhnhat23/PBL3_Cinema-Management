import type { Key } from "react";

import { useCallback, useEffect, useRef, useState } from "react";
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

import { CalendarIcon, EllipsisVertical, Eye, PenLine, Trash, Video } from "lucide-react";
import { StarIcon } from "@/components/icons/star";
import { useMovieStore, type Movie } from "@/stores/useMovieStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns";

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
    const { movies, isFetchingMovies, isUpdatingMovie, fetchAllMovies, getStatusLabel, updateMovie } = useMovieStore();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const popoverContainerRef = useRef<HTMLDivElement | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        overview: "",
        release_date: "",
        end_date: "",
        status: "0",
        runtime: "",
        adult: "false",
    });

    const toDateInputValue = (value?: Date | string | null) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return format(date, "yyyy-MM-dd");
    };

    const parseLocalDate = (value?: string) => {
        if (!value) return undefined;

        const [year, month, day] = value.split("-").map(Number);
        if (!year || !month || !day) return undefined;

        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? undefined : date;
    };

    const toApiDate = (value: string) => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day, 12, 0, 0);
    };

    const syncEditForm = useCallback((movie: Movie) => {
        setEditForm({
            title: movie.title ?? "",
            overview: movie.overview ?? "",
            release_date: toDateInputValue(movie.release_date),
            end_date: toDateInputValue(movie.end_date),
            status: String(movie.status ?? 0),
            runtime: movie.runtime ? String(movie.runtime) : "",
            adult: String(Boolean(movie.adult)),
        });
    }, []);

    const handleOpenEdit = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
        syncEditForm(movie);
        onEditOpen();
    }, [onEditOpen, syncEditForm]);

    const handleSaveMovie = async () => {
        if (!selectedMovie) return;

        const updatedMovie = await updateMovie(selectedMovie.movie_id, {
            title: editForm.title.trim(),
            overview: editForm.overview.trim(),
            release_date: editForm.release_date ? toApiDate(editForm.release_date) : undefined,
            end_date: editForm.end_date ? toApiDate(editForm.end_date) : undefined,
            status: Number(editForm.status) as Movie["status"],
            runtime: editForm.runtime ? Number(editForm.runtime) : undefined,
            adult: editForm.adult === "true",
        });

        if (updatedMovie) {
            setSelectedMovie(updatedMovie);
            onEditOpenChange();
        }
    };

    const releaseDateValue = parseLocalDate(editForm.release_date);
    const endDateValue = parseLocalDate(editForm.end_date);

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

                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={18} />}
                                showDivider
                                onPress={() => {
                                    handleOpenEdit(movie);
                                }}
                            >
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
    }, [getStatusLabel, handleOpenEdit, onOpen]);

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
                    {() => (
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
                                <button onClick={onOpenChange} className="dark:text-black text-white font-semibold border-1 border-zinc-200 dark:border-neutral-200 rounded-sm px-4 py-2 bg-neutral-800 dark:bg-neutral-100 shadow-[0_0_4px_#ffffff] cursor-pointer">
                                    Đóng
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                Sửa phim
                            </DrawerHeader>

                            <DrawerBody>
                                <p className="text-sm text-zinc-500">Thực hiện các thay đổi cho phim</p>

                                <div ref={popoverContainerRef} className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right">
                                            Tên phim
                                        </Label>

                                        <Input
                                            id="title"
                                            value={editForm.title}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="overview" className="text-right pt-2">
                                            Mô tả
                                        </Label>

                                        <Textarea
                                            id="overview"
                                            value={editForm.overview}
                                            placeholder="Nhập mô tả phim"
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, overview: event.target.value }))}
                                            className="col-span-3 text-sm min-h-auto"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="runtime" className="text-right">
                                            Thời lượng
                                        </Label>

                                        <Input
                                            id="runtime"
                                            type="number"
                                            min={0}
                                            value={editForm.runtime}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, runtime: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="release_date" className="text-right">
                                            Ngày chiếu
                                        </Label>

                                        <div className="col-span-3">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        data-empty={!releaseDateValue}
                                                        className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-sidebar"
                                                    >
                                                        <CalendarIcon />
                                                        {releaseDateValue ? format(releaseDateValue, "PPP") : <span>Chọn ngày</span>}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent container={popoverContainerRef.current} className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={releaseDateValue}
                                                        onSelect={(selectedDate) => {
                                                            setEditForm((prev) => ({
                                                                ...prev,
                                                                release_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                                                            }));
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="end_date" className="text-right">
                                            Kết thúc
                                        </Label>

                                        <div className="col-span-3">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        data-empty={!endDateValue}
                                                        className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-sidebar"
                                                    >
                                                        <CalendarIcon />
                                                        {endDateValue ? format(endDateValue, "PPP") : <span>Chọn ngày</span>}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent container={popoverContainerRef.current} className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={endDateValue}
                                                        onSelect={(selectedDate) => {
                                                            setEditForm((prev) => ({
                                                                ...prev,
                                                                end_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                                                            }));
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            Trạng thái
                                        </Label>

                                        <Select
                                            value={editForm.status}
                                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
                                        >
                                            <SelectTrigger className="col-span-3 w-full bg-sidebar">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>

                                            <SelectContent container={popoverContainerRef.current}>
                                                <SelectGroup>
                                                    <SelectLabel>Trạng thái</SelectLabel>
                                                    <SelectItem value="0">Released</SelectItem>
                                                    <SelectItem value="1">Upcoming</SelectItem>
                                                    <SelectItem value="2">Ended</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="adult" className="text-right">
                                            Giới hạn tuổi
                                        </Label>

                                        <Select
                                            value={editForm.adult}
                                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, adult: value }))}
                                        >
                                            <SelectTrigger className="col-span-3 w-full bg-sidebar">
                                                <SelectValue placeholder="Chọn giới hạn tuổi" />
                                            </SelectTrigger>

                                            <SelectContent container={popoverContainerRef.current}>
                                                <SelectGroup>
                                                    <SelectLabel>18+</SelectLabel>
                                                    <SelectItem value="false">False</SelectItem>
                                                    <SelectItem value="true">True</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </DrawerBody>

                            <DrawerFooter>
                                <button
                                    type="button"
                                    onClick={handleSaveMovie}
                                    disabled={isUpdatingMovie}
                                    className="dark:text-black text-white font-semibold border-1 border-zinc-200 dark:border-neutral-200 rounded-sm px-4 py-2 bg-neutral-800 dark:bg-neutral-100 shadow-[0_0_4px_#ffffff] cursor-pointer"
                                >
                                    {isUpdatingMovie ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}
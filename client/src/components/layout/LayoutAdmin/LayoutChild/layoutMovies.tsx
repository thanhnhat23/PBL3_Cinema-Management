import type { Key } from "react";
import { useTranslation } from "react-i18next";

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
    useDisclosure,
} from "@heroui/react";

import { CalendarIcon, Clapperboard, EllipsisVertical, Eye, PenLine, Trash } from "lucide-react";
import { StarIcon } from "@/components/icons/star";
import { useMovieStore, type Movie } from "@/stores/useMovieStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
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

const getMovieColumns = (t: any): AdminColumn[] => [
    { name: "ID", uid: "movie_id", sortable: true },
    { name: t('movie_details.title'), uid: "title", sortable: true },
    { name: t('movie_details.runtime'), uid: "runtime", sortable: true },
    { name: t('movie_details.vote_average'), uid: "vote_average", sortable: true },
    { name: t('movie_details.vote_count'), uid: "vote_count", sortable: true },
    { name: t('movie_details.release_date'), uid: "release_date", sortable: true },
    { name: t('movie_details.status'), uid: "status", sortable: true },
    { name: t('common.actions'), uid: "actions" },
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

export default function LayoutMovie() {
    const { t } = useTranslation();
    const { movies, isFetchingMovies, isUpdatingMovie, fetchAllMovies, getStatusLabel, updateMovie } = useMovieStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const popoverContainerRef = useRef<HTMLDivElement | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        overview: "",
        release_date: "",
        end_date: "",
        status: "0",
        runtime: "",
        adult: "false",
        poster_path: "",
        backdrop_path: "",
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
            poster_path: movie.poster_path ?? "",
            backdrop_path: movie.backdrop_path ?? "",
        });
    }, []);

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedMovie(null);
        setEditForm({
            title: "",
            overview: "",
            release_date: "",
            end_date: "",
            status: "0",
            runtime: "",
            adult: "false",
            poster_path: "",
            backdrop_path: "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleOpenEdit = useCallback((movie: Movie) => {
        setIsAdding(false);
        setSelectedMovie(movie);
        syncEditForm(movie);
        onEditOpen();
    }, [onEditOpen, syncEditForm]);

    const handleSave = async () => {
        const payload = {
            title: editForm.title.trim(),
            overview: editForm.overview.trim(),
            release_date: editForm.release_date ? toApiDate(editForm.release_date) : undefined,
            end_date: editForm.end_date ? toApiDate(editForm.end_date) : undefined,
            status: Number(editForm.status) as Movie["status"],
            runtime: editForm.runtime ? Number(editForm.runtime) : undefined,
            adult: editForm.adult === "true",
            poster_path: editForm.poster_path.trim(),
            backdrop_path: editForm.backdrop_path.trim(),
        };

        if (isAdding) {
            const { createMovie } = useMovieStore.getState();
            await createMovie(payload);
            onEditOpenChange();
        } else if (selectedMovie) {
            const updatedMovie = await updateMovie(selectedMovie.movie_id, payload);
            if (updatedMovie) {
                setSelectedMovie(updatedMovie);
                onEditOpenChange();
            }
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
                return <span>{movie.runtime} {t('movie_details.minutes')}</span>;
            case "vote_average":
                return <span className="font-semibold">{Number(movie.vote_average ?? 0).toFixed(1)}</span>;
            case "vote_count":
                return <span>{movie.vote_count}</span>;
            case "release_date":
                return <span>{new Date(String(movie.release_date)).toLocaleDateString(t('locale_code'))}</span>;
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[movie.status]} size="sm" variant="flat">
                        {t(`movie_status.${getStatusLabel(movie.status)}`)}
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
                                {t('common.view')}
                            </DropdownItem>

                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={18} />}
                                showDivider
                                onPress={() => {
                                    handleOpenEdit(movie);
                                }}
                            >
                                {t('movie_details.edit_movie')}
                            </DropdownItem>

                            <DropdownItem
                                key="delete"
                                startContent={<Trash size={18} />}
                                className="text-danger"
                                color="danger"
                                onPress={() => {
                                    const { deleteMovie } = useMovieStore.getState();
                                    deleteMovie(movie.movie_id);
                                }}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [getStatusLabel, handleOpenEdit, onOpen, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Clapperboard size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('dashboard.management.movies')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('dashboard.charts.movie_genre.desc')}
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Movie>
                columns={getMovieColumns(t)}
                items={movies}
                isLoading={isFetchingMovies}
                searchPlaceholder={t('movie_details.search_placeholder')}
                addButtonLabel={t('movie_details.add_movie')}
                onAdd={handleOpenAdd}
                totalLabel={(count) => t('movie_details.total_count', { count })}
                emptyLabel={t('movie_details.empty_label')}
                loadingLabel={t('movie_details.loading_label')}
                defaultSort={{ column: "release_date", direction: "descending" }}
                rowKey={(item) => item.movie_id}
                searchBy={(item) => item.title}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "status",
                        name: t('movie_details.status'),
                        options: [
                            { name: t('movie_status.released'), uid: "0" },
                            { name: t('movie_status.upcoming'), uid: "1" },
                            { name: t('movie_status.ended'), uid: "2" },
                        ]
                    }
                ]}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {selectedMovie ? t('movie_details.view_details', { title: selectedMovie.title }) : t('movie_details.details_title')}
                            </DrawerHeader>

                            <DrawerBody className="px-0">
                                {selectedMovie ? (
                                    <div className="flex flex-col gap-0">
                                        <div className="relative w-full h-64">
                                            <Image
                                                src={`https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`}
                                                alt={selectedMovie.title}
                                                fill
                                                className="object-cover opacity-50 grayscale-[0.5]"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-sidebar to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-6 flex items-end gap-6 w-full">
                                                <div className="relative w-32 h-48 shrink-0 shadow-2xl rounded-lg overflow-hidden border-2 border-white/10">
                                                    <Image
                                                        src={getPosterSrc(selectedMovie.poster_path)}
                                                        alt={selectedMovie.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2 pb-2">
                                                    <h2 className="text-3xl font-bold text-white drop-shadow-md">{selectedMovie.title}</h2>
                                                    <div className="flex gap-2 flex-wrap">
                                                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                                                            {t(`movie_status.${getStatusLabel(selectedMovie.status)}`)}
                                                        </Badge>
                                                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 flex gap-1 items-center">
                                                            {Number(selectedMovie.vote_average ?? 0).toFixed(1)}
                                                            <StarIcon className="w-3 h-3" />
                                                        </Badge>
                                                        <Badge variant="outline" className="text-white/60 border-white/10">
                                                            {selectedMovie.runtime} {t('movie_details.minutes')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col gap-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('movie_details.release_date_label')}</span>
                                                    <span className="text-sm font-semibold">{new Date(String(selectedMovie.release_date)).toLocaleDateString(t('locale_code'))}</span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('movie_details.vote_count')}</span>
                                                    <span className="text-sm font-semibold">{selectedMovie.vote_count.toLocaleString(t('locale_code'))}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('movie_details.description')}</span>
                                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                                    {selectedMovie.overview || t('movie_details.no_overview')}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('movie_details.metadata')}</span>
                                                <div className="flex flex-wrap gap-2">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sidebar border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium">
                                                        <span className="text-zinc-400">ID:</span> {selectedMovie.movie_id}
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sidebar border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium">
                                                        <span className="text-zinc-400">{t('movie_details.age_limit')}:</span> {selectedMovie.adult ? "18+" : "All"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500">{t('movie_details.no_data')}</div>
                                )}
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {isAdding ? t('movie_details.add_new_movie') : t('movie_details.edit_movie')}
                            </DrawerHeader>

                            <DrawerBody>
                                <p className="text-sm text-zinc-500">{t('movie_details.edit_desc')}</p>

                                <div ref={popoverContainerRef} className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right">
                                            {t('movie_details.movie_name')}
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
                                            {t('movie_details.description')}
                                        </Label>

                                        <Textarea
                                            id="overview"
                                            value={editForm.overview}
                                            placeholder={t('movie_details.enter_description')}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, overview: event.target.value }))}
                                            className="col-span-3 text-sm min-h-auto"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="runtime" className="text-right">
                                            {t('movie_details.runtime_label')}
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
                                            {t('movie_details.release_date_label')}
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
                                                        {releaseDateValue ? format(releaseDateValue, "PPP") : <span>{t('movie_details.select_date')}</span>}
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
                                            {t('movie_details.end_date_label')}
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
                                                        {endDateValue ? format(endDateValue, "PPP") : <span>{t('movie_details.select_date')}</span>}
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
                                            {t('movie_details.status')}
                                        </Label>

                                        <Select
                                            value={editForm.status}
                                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
                                        >
                                            <SelectTrigger className="col-span-3 w-full bg-sidebar">
                                                <SelectValue placeholder={t('movie_details.status')} />
                                            </SelectTrigger>

                                            <SelectContent container={popoverContainerRef.current}>
                                                <SelectGroup>
                                                    <SelectLabel>{t('movie_details.status')}</SelectLabel>
                                                    <SelectItem value="0">{t('movie_status.released')}</SelectItem>
                                                    <SelectItem value="1">{t('movie_status.upcoming')}</SelectItem>
                                                    <SelectItem value="2">{t('movie_status.ended')}</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="poster" className="text-right">
                                            Poster Path
                                        </Label>
                                        <Input
                                            id="poster"
                                            value={editForm.poster_path}
                                            placeholder="/path/to/poster.jpg"
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, poster_path: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="backdrop" className="text-right">
                                            Backdrop Path
                                        </Label>
                                        <Input
                                            id="backdrop"
                                            value={editForm.backdrop_path}
                                            placeholder="/path/to/backdrop.jpg"
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, backdrop_path: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="adult" className="text-right">
                                            {t('movie_details.age_limit')}
                                        </Label>

                                        <Select
                                            value={editForm.adult}
                                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, adult: value }))}
                                        >
                                            <SelectTrigger className="col-span-3 w-full bg-sidebar">
                                                <SelectValue placeholder={t('movie_details.age_limit')} />
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
                                    onClick={handleSave}
                                    disabled={isUpdatingMovie}
                                    className="dark:text-black text-white font-semibold border-1 border-zinc-200 dark:border-neutral-200 rounded-sm px-4 py-2 bg-neutral-800 dark:bg-neutral-100 shadow-[0_0_4px_#ffffff] cursor-pointer"
                                >
                                    {isUpdatingMovie ? t('movie_details.saving') : t('movie_details.save_changes')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

import { Drama, EllipsisVertical, Eye, PenLine, Trash, CalendarIcon, Clapperboard, MonitorPlay } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, type Key, useCallback, useState, useRef } from "react";
import { useShowTimeStore, type ShowTime } from "@/stores/useShowTimeStore";
import { useMovieStore } from "@/stores/useMovieStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useShowTimeSlotStore } from "@/stores/useShowTimeSlotStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
} from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format, differenceInDays, startOfDay, getDay, parseISO } from "date-fns";
import Image from "next/image";

interface ShowtimeDisplay extends ShowTime {
    movie_title?: string;
    cinema_name?: string;
    room_name?: string;
}

const getShowtimeColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: "ID", uid: "showtime_id", sortable: true },
    { name: t('movie_details.title'), uid: "movie_title", sortable: true },
    { name: t('dashboard.management.cinemas'), uid: "cinema_name", sortable: true },
    { name: t('showtimes_tab.columns.room'), uid: "room_name", sortable: true },
    { name: t('showtimes_tab.columns.start_time'), uid: "startTime", sortable: true },
    { name: t('showtimes_tab.columns.end_time'), uid: "endTime", sortable: true },
    { name: t('showtimes_tab.pricing_model.label'), uid: "pricing_model" },
    { name: t('common.status'), uid: "status" },
    { name: t('common.actions'), uid: "actions" },
];

export default function LayoutShowtime() {
    const { t } = useTranslation();
    const { showtimes, isFetching, fetchAllShowtimes, deleteShowtime, updateShowtime, createShowtimeFromSlot, isUpdating, isCreating } = useShowTimeStore();
    const { movies, fetchAllMovies } = useMovieStore();
    const { rooms, fetchAllRooms } = useRoomStore();
    const { slots, fetchAll: fetchAllSlots } = useShowTimeSlotStore();
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<ShowtimeDisplay | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);

    const [editForm, setEditForm] = useState({
        movie_id: "",
        room_id: "",
        startTime: "",
        endTime: "",
        pricing_model: "0",
        slot_id: "",
        date: format(new Date(), "yyyy-MM-dd"),
        status: "1"
    });

    useEffect(() => {
        fetchAllShowtimes();
        fetchAllMovies();
        fetchAllRooms();
        fetchAllSlots();
    }, [fetchAllShowtimes, fetchAllMovies, fetchAllRooms, fetchAllSlots]);

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedItem(null);
        setEditForm({
            movie_id: "",
            room_id: "",
            startTime: "",
            endTime: "",
            pricing_model: "0",
            slot_id: "",
            date: format(new Date(), "yyyy-MM-dd"),
            status: "1"
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleOpenEdit = useCallback((item: ShowtimeDisplay) => {
        setIsAdding(false);
        setSelectedItem(item);
        
        const datePart = String(item.startTime).split('T')[0];
        const startT = item.Slot?.startTime ? `${datePart}T${item.Slot.startTime.substring(0, 5)}` : format(new Date(item.startTime), "yyyy-MM-dd'T'HH:mm");
        const endT = item.Slot?.endTime ? `${datePart}T${item.Slot.endTime.substring(0, 5)}` : format(new Date(item.endTime), "yyyy-MM-dd'T'HH:mm");

        setEditForm({
            movie_id: String(item.movie_id),
            room_id: String(item.room_id),
            startTime: startT,
            endTime: endT,
            pricing_model: String(item.pricing_model),
            slot_id: String(item.slot_id || ""),
            date: datePart,
            status: String(item.status)
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSave = async () => {
        if (isAdding) {
            const payload = {
                room_id: Number(editForm.room_id),
                movie_id: Number(editForm.movie_id),
                slot_id: Number(editForm.slot_id),
                date: editForm.date,
                pricing_model: Number(editForm.pricing_model),
                status: Number(editForm.status)
            };
            await createShowtimeFromSlot(payload);
        } else if (selectedItem) {
            const payload = {
                room_id: Number(editForm.room_id),
                movie_id: Number(editForm.movie_id),
                startTime: new Date(editForm.startTime).toISOString(),
                endTime: new Date(editForm.endTime).toISOString(),
                pricing_model: Number(editForm.pricing_model),
                status: Number(editForm.status)
            };
            await updateShowtime(selectedItem.showtime_id, payload);
        }
        await fetchAllShowtimes();
        onEditOpenChange();
    };

    const renderCell = useCallback((item: ShowtimeDisplay, columnKey: Key) => {
        const cellValue = item[columnKey as keyof ShowtimeDisplay];
        switch (columnKey) {
            case "movie_title":
                return (
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 relative rounded-md overflow-hidden border border-zinc-100 dark:border-white/5 shadow-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            {item.Movie?.movie_id ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w185${(item.Movie as any)?.poster_path || ""}`}
                                    alt={item.movie_title || ""}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            ) : (
                                <Clapperboard size={16} className="text-zinc-400" />
                            )}
                        </div>
                        <span className="text-sm font-bold truncate max-w-50" title={item.movie_title}>
                            {item.movie_title}
                        </span>
                    </div>
                );
            case "startTime":
            case "endTime": {
                const datePart = String(item.startTime).split('T')[0];
                const timePart = columnKey === "startTime" ? item.Slot?.startTime : item.Slot?.endTime;
                
                if (timePart) {
                    const combined = parseISO(`${datePart}T${timePart}`);
                    return <span className="text-sm font-medium">{format(combined, "dd/MM/yyyy HH:mm")}</span>;
                }

                return <span className="text-sm font-medium">{format(new Date(String(cellValue)), "dd/MM/yyyy HH:mm")}</span>;
            }
            case "pricing_model":
                return (
                    <Badge variant="outline" className={item.pricing_model === 1 ? "border-blue-500 text-blue-500" : item.pricing_model === 2 ? "border-purple-500 text-purple-500" : "border-zinc-500 text-zinc-500"}>
                        {item.pricing_model === 0 ? t('showtimes_tab.pricing_model.price_based') : 
                         item.pricing_model === 1 ? t('showtimes_tab.pricing_model.seat_based') : 
                         t('showtimes_tab.pricing_model.mixed')}
                    </Badge>
                );
            case "status": {
                const statusColors: Record<number, string> = {
                    0: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200", // Draft
                    1: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", // Scheduled
                    2: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", // Published
                    3: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", // Ended
                    4: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", // Cancelled
                };
                return (
                    <Badge className={statusColors[item.status] || ""}>
                        {t(`common.status_names.${item.status}`)}
                    </Badge>
                );
            }
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
                        <DropdownMenu aria-label="Showtime Actions">
                            <DropdownItem 
                                key="view" 
                                startContent={<Eye size={16} />}
                                onPress={() => {
                                    setSelectedItem(item);
                                    onOpen();
                                }}
                            >
                                {t('common.view')}
                            </DropdownItem>
                            <DropdownItem 
                                key="edit" 
                                startContent={<PenLine size={16} />} 
                                onPress={() => handleOpenEdit(item)}
                            >
                                {t('common.edit')}
                            </DropdownItem>
                            <DropdownItem 
                                key="delete" 
                                startContent={<Trash size={16} />} 
                                className="text-danger" 
                                color="danger"
                                onPress={() => deleteShowtime(item.showtime_id)}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [deleteShowtime, handleOpenEdit, onOpen, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Drama size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('showtimes_tab.tabs.showtime')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('showtimes_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>

            <DataTableAdmin<ShowtimeDisplay>
                columns={getShowtimeColumns(t)}
                items={showtimes.map(st => ({
                    ...st,
                    movie_title: st.Movie?.title,
                    cinema_name: st.Room?.Cinema?.name,
                    room_name: st.Room?.nameRoom
                }))}
                isLoading={isFetching}
                searchPlaceholder={t('showtimes_tab.search_placeholder')}
                onAdd={handleOpenAdd}
                addButtonLabel={t('common.add_new')}
                totalLabel={(count) => t('showtimes_tab.total_count', { count })}
                emptyLabel={t('showtimes_tab.empty_label')}
                loadingLabel={t('showtimes_tab.loading_label')}
                defaultSort={{ column: "startTime", direction: "descending" }}
                rowKey={(item) => item.showtime_id}
                searchBy={(item) => item.movie_title || ""}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "pricing_model",
                        name: t('showtimes_tab.pricing_model.label'),
                        options: [
                            { name: t('showtimes_tab.pricing_model.price_based'), uid: "0" },
                            { name: t('showtimes_tab.pricing_model.seat_based'), uid: "1" },
                            { name: t('showtimes_tab.pricing_model.mixed'), uid: "2" },
                        ]
                    }
                ]}
            />

            {/* View Details Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {selectedItem ? t('movie_details.view_details', { title: selectedItem.movie_title }) : t('showtimes_tab.details_title')}
                            </DrawerHeader>
                            <DrawerBody className="px-0">
                                {selectedItem ? (
                                    <div className="flex flex-col">
                                        <div className="relative w-full h-64">
                                            <Image
                                                src={`https://image.tmdb.org/t/p/original/${(selectedItem.Movie as any)?.backdrop_path || ""}`}
                                                alt={selectedItem.movie_title || ""}
                                                fill
                                                className="object-cover opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-sidebar to-transparent" />
                                            <div className="absolute bottom-6 left-6 flex items-end gap-4">
                                                <div className="relative w-24 h-36 rounded-lg overflow-hidden border-2 border-white/10 shadow-xl">
                                                    <Image
                                                        src={`https://image.tmdb.org/t/p/w342${((selectedItem.Movie as any)?.poster_path || "")}`}
                                                        alt={selectedItem.movie_title || ""}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 pb-2">
                                                    <h2 className="text-2xl font-bold text-white">{selectedItem.movie_title}</h2>
                                                    <Badge variant="secondary" className="w-fit bg-purple-500/20 text-purple-400 border-purple-500/30 uppercase text-[10px] font-black">
                                                        {t('showtimes_tab.id_label')}: {selectedItem.showtime_id}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col gap-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('dashboard.management.cinemas')}</span>
                                                    <span className="text-sm font-bold">{selectedItem.cinema_name}</span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('showtimes_tab.columns.room')}</span>
                                                    <span className="text-sm font-bold">{selectedItem.room_name}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('showtimes_tab.columns.start_time')}</span>
                                                        <div className="flex items-center gap-2 text-sm font-bold">
                                                            <CalendarIcon size={14} className="text-purple-500" />
                                                            {(() => {
                                                                const datePart = String(selectedItem.startTime).split('T')[0];
                                                                const timePart = selectedItem.Slot?.startTime;
                                                                if (timePart) {
                                                                    return format(parseISO(`${datePart}T${timePart}`), "PPP p");
                                                                }
                                                                return format(new Date(selectedItem.startTime), "PPP p");
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('showtimes_tab.columns.end_time')}</span>
                                                        <div className="flex items-center gap-2 text-sm font-bold">
                                                            <CalendarIcon size={14} className="text-purple-500" />
                                                            {(() => {
                                                                const datePart = String(selectedItem.startTime).split('T')[0];
                                                                const timePart = selectedItem.Slot?.endTime;
                                                                if (timePart) {
                                                                    return format(parseISO(`${datePart}T${timePart}`), "PPP p");
                                                                }
                                                                return format(new Date(selectedItem.endTime), "PPP p");
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('showtimes_tab.pricing_model.label')}</span>
                                                    <Badge variant="outline" className={selectedItem.pricing_model === 1 ? "border-blue-500 text-blue-500" : selectedItem.pricing_model === 2 ? "border-purple-500 text-purple-500" : "border-zinc-500 text-zinc-500"}>
                                                        {selectedItem.pricing_model === 0 ? t('showtimes_tab.pricing_model.price_based') : 
                                                         selectedItem.pricing_model === 1 ? t('showtimes_tab.pricing_model.seat_based') : 
                                                         t('showtimes_tab.pricing_model.mixed')}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('common.status')}</span>
                                                    {(() => {
                                                        const statusColors: Record<number, string> = {
                                                            0: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
                                                            1: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                                                            2: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                                            3: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
                                                            4: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                                        };
                                                        return (
                                                            <Badge className={`${statusColors[selectedItem.status] || ""} w-fit`}>
                                                                {t(`common.status_names.${selectedItem.status}`)}
                                                            </Badge>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500">{t('common.no_data')}</div>
                                )}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button onClick={onClose} className="w-full font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                                    {t('common.close')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Edit/Add Drawer */}
            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {isAdding ? t('common.add_new') : t('common.edit')}
                            </DrawerHeader>
                            <DrawerBody>
                                <div ref={drawerContainerRef} className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="movie_id" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('movie_details.movie_name')}</Label>
                                        <div onPointerDown={e => e.stopPropagation()}>
                                            <Select value={editForm.movie_id} onValueChange={(v) => setEditForm(p => ({ ...p, movie_id: v }))}>
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                    <SelectValue placeholder={t('showtimes_tab.placeholders.select_movie')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {movies.filter(m => {
                                                            const today = startOfDay(new Date());
                                                            const releaseDate = new Date(m.release_date);
                                                            
                                                            // Status 0: Released (Now Playing)
                                                            if (m.status === 0) return true;
                                                            
                                                            // Status 1: Upcoming - only within 5 days
                                                            if (m.status === 1) {
                                                                const daysUntilRelease = differenceInDays(releaseDate, today);
                                                                return daysUntilRelease >= 0 && daysUntilRelease <= 5;
                                                            }
                                                            
                                                            return false;
                                                        }).map(m => (
                                                            <SelectItem key={m.movie_id} value={String(m.movie_id)} textValue={m.title} className="py-2 px-1">
                                                                <div className="flex items-center gap-3 w-full">
                                                                    {/* Hide image when rendered inside SelectValue (the trigger) */}
                                                                    <div className="relative w-8 h-12 rounded-sm overflow-hidden shrink-0 in-data-[slot=select-value]:hidden">
                                                                        <Image 
                                                                            src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                                                                            alt={m.title}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col gap-0.5 min-w-0">
                                                                        <span className="font-bold text-sm truncate">{m.title}</span>
                                                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-black in-data-[slot=select-value]:hidden">
                                                                            {m.status === 0 ? t('common.released') : t('common.upcoming')} • {format(new Date(m.release_date), "dd/MM/yyyy")}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="room_id" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.columns.room')}</Label>
                                        <div onPointerDown={e => e.stopPropagation()}>
                                            <Select value={editForm.room_id} onValueChange={(v) => setEditForm(p => ({ ...p, room_id: v }))}>
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg"><SelectValue placeholder={t('showtimes_tab.placeholders.select_room')} /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {rooms.map(r => (
                                                            <SelectItem key={r.room_id} value={String(r.room_id)}>
                                                                {r.nameRoom} ({r.cinema?.name})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {isAdding ? (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('common.date')}</Label>
                                                    <Input 
                                                        id="date" 
                                                        type="date" 
                                                        value={editForm.date} 
                                                        onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))}
                                                        className="bg-sidebar h-12 rounded-lg"
                                                    />
                                                </div>
                                                <div className="grid gap-2" onPointerDown={e => e.stopPropagation()}>
                                                    <Label htmlFor="slot_id" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.tabs.slot')}</Label>
                                                    <Select value={editForm.slot_id} onValueChange={(v) => setEditForm(p => ({ ...p, slot_id: v }))}>
                                                        <SelectTrigger className="bg-sidebar h-12 rounded-lg"><SelectValue placeholder={t('showtimes_tab.placeholders.select_slot')} /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {(() => {
                                                                    const selectedDate = parseISO(editForm.date);
                                                                    const dayOfWeek = getDay(selectedDate);
                                                                    const filteredSlots = slots.filter(s => s.dayOfWeek === dayOfWeek);
                                                                    
                                                                    if (filteredSlots.length === 0) {
                                                                        return <SelectItem value="none">{t('showtimes_tab.placeholders.no_slots_for_day')}</SelectItem>;
                                                                    }
                                                                    
                                                                    return filteredSlots.map(s => (
                                                                        <SelectItem key={s.slot_id} value={String(s.slot_id)}>
                                                                            {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)} ({t(`common.day_names.${s.dayOfWeek}`)})
                                                                        </SelectItem>
                                                                    ));
                                                                })()}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="grid gap-2" onPointerDown={e => e.stopPropagation()}>
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('common.status')}</Label>
                                                    <Select value={editForm.status} onValueChange={(v) => setEditForm(p => ({ ...p, status: v }))}>
                                                        <SelectTrigger className="bg-sidebar h-12 rounded-lg"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {[0, 1, 2, 3, 4].map(s => (
                                                                    <SelectItem key={s} value={String(s)}>
                                                                        {t(`common.status_names.${s}`)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="startTime" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.columns.start_time')}</Label>
                                                    <Input 
                                                        id="startTime" 
                                                        type="datetime-local" 
                                                        value={editForm.startTime} 
                                                        onChange={e => setEditForm(p => ({ ...p, startTime: e.target.value }))}
                                                        className="bg-sidebar h-12 rounded-lg"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="endTime" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.columns.end_time')}</Label>
                                                    <Input 
                                                        id="endTime" 
                                                        type="datetime-local" 
                                                        value={editForm.endTime} 
                                                        onChange={e => setEditForm(p => ({ ...p, endTime: e.target.value }))}
                                                        className="bg-sidebar h-12 rounded-lg"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="grid gap-2" onPointerDown={e => e.stopPropagation()}>
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.pricing_model.label')}</Label>
                                        <Select value={editForm.pricing_model} onValueChange={(v) => setEditForm(p => ({ ...p, pricing_model: v }))}>
                                            <SelectTrigger className="bg-sidebar h-12 rounded-lg"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="0">{t('showtimes_tab.pricing_model.price_based')}</SelectItem>
                                                    <SelectItem value="1">{t('showtimes_tab.pricing_model.seat_based')}</SelectItem>
                                                    <SelectItem value="2">{t('showtimes_tab.pricing_model.mixed')}</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {!isCreating && (
                                        <div className="grid gap-2" onPointerDown={e => e.stopPropagation()}>
                                            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('common.status')}</Label>
                                            <Select value={editForm.status} onValueChange={(v) => setEditForm(p => ({ ...p, status: v }))}>
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {[0, 1, 2, 3, 4].map(s => (
                                                            <SelectItem key={s} value={String(s)}>
                                                                {t(`common.status_names.${s}`)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </DrawerBody>
                            <DrawerFooter className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isUpdating || isCreating}
                                    className="flex-1 dark:text-black text-white font-bold border border-zinc-200 dark:border-neutral-200 rounded-lg py-2 bg-neutral-800 dark:bg-neutral-100 shadow-[0_0_8px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50"
                                >
                                    {(isUpdating || isCreating) ? t('common.saving') : t('common.save')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

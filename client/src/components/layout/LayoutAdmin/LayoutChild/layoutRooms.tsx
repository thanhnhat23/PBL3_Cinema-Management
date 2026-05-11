import type { Key } from "react";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { DoorOpen, EllipsisVertical, Eye, PenLine, Trash, Users } from "lucide-react";

import { useRoomStore, type Room } from "@/stores/useRoomStore";
import { useCinemaStore } from "@/stores/useCinemaStore";
import { useSeatTypeStore } from "@/stores/useSeatTypeStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const getRoomColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: "ID", uid: "room_id", sortable: true },
    { name: t('rooms_tab.columns.name'), uid: "nameRoom", sortable: true },
    { name: t('rooms_tab.columns.cinema'), uid: "cinema", sortable: true },
    { name: t('rooms_tab.columns.type'), uid: "roomLayoutType", sortable: true },
    { name: t('rooms_tab.columns.price'), uid: "price", sortable: true },
    { name: t('rooms_tab.columns.layout'), uid: "row", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

const roomLayoutTypeColorMap: Record<string, "primary" | "success" | "warning" | "danger"> = {
    standard: "primary",
    imax: "success",
    "4dx": "warning",
    "3d": "danger",
};

const getRoomLayoutTypeText = (type: number) => {
    switch (type) {
        case 0: return "Standard";
        case 1: return "IMAX";
        case 2: return "4DX";
        case 3: return "3D";
        default: return "Unknown";
    }
};

export default function LayoutRooms() {
    const { t } = useTranslation();
    const { rooms, isFetchingRooms, fetchAllRooms, createRoom, updateRoom, deleteRoom, isCreatingRoom, isUpdatingRoom } = useRoomStore();
    const { cinemas, fetchAllCinemas } = useCinemaStore();
    const { seatTypes, fetchAll: fetchSeatTypes } = useSeatTypeStore();
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);

    const [form, setForm] = useState({
        cinema_id: "",
        nameRoom: "",
        roomLayoutType: "0",
        price: "",
        row: "",
        column: "",
    });

    useEffect(() => {
        fetchAllRooms();
        fetchAllCinemas();
        fetchSeatTypes();
    }, [fetchAllRooms, fetchAllCinemas, fetchSeatTypes]);

    const handleOpenAdd = () => {
        setIsAdding(true);
        setSelectedRoom(null);
        setForm({
            cinema_id: "",
            nameRoom: "",
            roomLayoutType: "0",
            price: "",
            row: "",
            column: "",
        });
        onEditOpen();
    };

    const handleOpenEdit = useCallback((room: Room) => {
        setIsAdding(false);
        setSelectedRoom(room);
        setForm({
            cinema_id: String(room.cinema_id),
            nameRoom: room.nameRoom,
            roomLayoutType: String(room.roomLayoutType),
            price: String(room.price),
            row: String(room.row),
            column: String(room.column),
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSave = async () => {
        const payload = {
            cinema_id: Number(form.cinema_id),
            nameRoom: form.nameRoom.trim(),
            roomLayoutType: Number(form.roomLayoutType) as 0 | 1 | 2 | 3,
            price: Number(form.price),
            row: Number(form.row),
            column: Number(form.column),
        };

        if (isAdding) {
            await createRoom(payload);
        } else if (selectedRoom) {
            await updateRoom(selectedRoom.room_id, payload);
        }
        await fetchAllRooms();
        onEditOpenChange();
    };

    const renderCell = useCallback((room: Room, columnKey: Key) => {
        const cellValue = room[columnKey as keyof Room];

        switch (columnKey) {
            case "nameRoom":
                return <span className="font-semibold">{room.nameRoom}</span>;
            case "cinema":
                return <span>{room.cinema?.name ?? "N/A"}</span>;
            case "roomLayoutType": {
                const typeText = getRoomLayoutTypeText(room.roomLayoutType);
                return (
                    <Chip className="capitalize" color={roomLayoutTypeColorMap[typeText.toLowerCase()]} size="sm" variant="flat">
                        {typeText}
                    </Chip>
                );
            }
            case "price":
                return <span className="font-bold text-emerald-600 dark:text-emerald-400">{Number(room.price).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}</span>;
            case "row":
                return <span>{`${room.row} x ${room.column}`}</span>;
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
                                startContent={<Eye size={16} />}
                                onPress={() => {
                                    setSelectedRoom(room);
                                    onOpen();
                                }}
                            >
                                {t('common.view')}
                            </DropdownItem>
                            <DropdownItem 
                                key="edit" 
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(room)}
                            >
                                {t('common.edit')}
                            </DropdownItem>
                            <DropdownItem 
                                key="delete" 
                                className="text-danger" 
                                color="danger" 
                                startContent={<Trash size={16} />}
                                onPress={() => deleteRoom(room.room_id)}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [deleteRoom, onOpen, handleOpenEdit, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <DoorOpen size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('rooms_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('rooms_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Room>
                columns={getRoomColumns(t)}
                items={rooms}
                isLoading={isFetchingRooms}
                searchPlaceholder={t('rooms_tab.search_placeholder')}
                addButtonLabel={t('rooms_tab.add_room')}
                onAdd={handleOpenAdd}
                totalLabel={(count) => t('rooms_tab.total_count', { count })}
                emptyLabel={t('rooms_tab.empty_label')}
                loadingLabel={t('rooms_tab.loading_label')}
                defaultSort={{ column: "nameRoom", direction: "ascending" }}
                rowKey={(item) => item.room_id}
                searchBy={(item) => item.nameRoom}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "cinema_id",
                        name: t('rooms_tab.columns.cinema'),
                        options: cinemas.map(c => ({ name: c.name, uid: String(c.cinema_id) }))
                    },
                    {
                        uid: "roomLayoutType",
                        name: t('rooms_tab.columns.type'),
                        options: [
                            { name: "Standard", uid: "0" },
                            { name: "IMAX", uid: "1" },
                            { name: "4DX", uid: "2" },
                            { name: "3D", uid: "3" },
                        ]
                    }
                ]}
            />

            {/* View Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {selectedRoom ? t('movie_details.view_details', { title: selectedRoom.nameRoom }) : t('rooms_tab.details_title')}
                            </DrawerHeader>
                            <DrawerBody>
                                {selectedRoom ? (
                                    <div className="flex flex-col gap-6 py-4">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                                    <DoorOpen className="text-zinc-600 dark:text-zinc-400" size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold tracking-tight">{selectedRoom.nameRoom}</h2>
                                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{getRoomLayoutTypeText(selectedRoom.roomLayoutType)} {t('location_tab.rooms')}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none px-2 py-0.5 text-[10px]">ID: {selectedRoom.room_id}</Badge>
                                                <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none px-2 py-0.5 text-[10px]">Active</Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center gap-4 p-4 rounded-xl border-1 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm">
                                                    <Users className="text-zinc-500" size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{t('rooms_tab.columns.cinema')}</span>
                                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{selectedRoom.cinema?.name ?? "N/A"}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-4 p-4 rounded-xl border-1 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{t('rooms_tab.capacity_label')}</span>
                                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t('rooms_tab.capacity_value', { count: selectedRoom.row * selectedRoom.column })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 rounded-xl border-1 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{t('rooms_tab.layout_label')}</span>
                                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{selectedRoom.row} x {selectedRoom.column}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl border-1 border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider">{t('rooms_tab.price_label')}</span>
                                                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{Number(selectedRoom.price).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}</span>
                                                </div>
                                                <div className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm text-emerald-600">
                                                    <PenLine size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{t('rooms_tab.seat_map_label')}</Label>
                                                <Badge variant="outline" className="text-[10px] font-normal border-zinc-200 dark:border-zinc-800 text-zinc-500 italic">{t('rooms_tab.auto_generated')}</Badge>
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-zinc-900/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                                                <div className="grid gap-1.5 border-1 border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-white dark:bg-zinc-950 overflow-auto max-h-96 shadow-inner" 
                                                     style={{ gridTemplateColumns: `repeat(${selectedRoom.column}, minmax(0, 1fr))` }}>
                                                    {Array.from({ length: selectedRoom.row * selectedRoom.column }).map((_, i) => {
                                                        const rowIndex = Math.floor(i / selectedRoom.column) + 1;
                                                        const colIndex = (i % selectedRoom.column) + 1;
                                                        const isCouple = colIndex > selectedRoom.column - 2;
                                                        return (
                                                            <div 
                                                                key={i} 
                                                                title={`Seat ${String.fromCharCode(64 + rowIndex)}${colIndex}`}
                                                                className={`aspect-square rounded-md transition-all duration-200 ${
                                                                    isCouple 
                                                                    ? "bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800" 
                                                                    : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                                                } border-1 hover:scale-110 cursor-help`} 
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mt-1">
                                                {seatTypes.map((type) => (
                                                    <div key={type.type_id} className="flex items-center gap-1.5">
                                                        <div className={`w-2.5 h-2.5 rounded-sm border-1 ${
                                                            type.type_id === 2 
                                                            ? "bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800" 
                                                            : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                                        }`} />
                                                        <span className="text-[10px] text-zinc-500 font-medium">
                                                            {typeof type.type_name === 'number' 
                                                                ? (type.type_id === 2 ? t('rooms_tab.seat_couple') : t('rooms_tab.seat_single'))
                                                                : type.type_name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>{t('cinemas_tab.no_data')}</p>
                                )}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button onClick={onClose} className="w-full font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                                    {t('foods_tab.close_details')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Edit/Add Drawer */}
            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {isAdding ? t('rooms_tab.add_new_room') : t('movie_details.edit_movie')}
                            </DrawerHeader>
                            <DrawerBody>
                                <div ref={drawerContainerRef} className="flex flex-col gap-4 py-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cinema_id" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('rooms_tab.columns.cinema')}</Label>
                                        <Select 
                                            value={form.cinema_id} 
                                            onValueChange={(v) => setForm(p => ({ ...p, cinema_id: v }))}
                                        >
                                            <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                <SelectValue placeholder={t('rooms_tab.columns.cinema')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>{t('rooms_tab.columns.cinema')}</SelectLabel>
                                                    {cinemas.map(c => (
                                                        <SelectItem key={c.cinema_id} value={String(c.cinema_id)}>
                                                            {c.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="nameRoom" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('rooms_tab.name_label')}</Label>
                                        <Input 
                                            id="nameRoom" 
                                            value={form.nameRoom} 
                                            onChange={(e) => setForm(p => ({ ...p, nameRoom: e.target.value }))}
                                            className="bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="roomLayoutType" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('rooms_tab.type_label')}</Label>
                                        <Select 
                                            value={form.roomLayoutType} 
                                            onValueChange={(v) => setForm(p => ({ ...p, roomLayoutType: v }))}
                                        >
                                            <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                <SelectValue placeholder={t('rooms_tab.type_label')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>{t('rooms_tab.type_label')}</SelectLabel>
                                                    <SelectItem value="0">Standard</SelectItem>
                                                    <SelectItem value="1">IMAX</SelectItem>
                                                    <SelectItem value="2">4DX</SelectItem>
                                                    <SelectItem value="3">3D</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('rooms_tab.price_label')}</Label>
                                        <Input 
                                            id="price" 
                                            type="number"
                                            placeholder="0vnd"
                                            value={form.price} 
                                            onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
                                            className="bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="row" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('rooms_tab.rows_label')}</Label>
                                            <Input 
                                                id="row" 
                                                type="number"
                                                value={form.row} 
                                                onChange={(e) => setForm(p => ({ ...p, row: e.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="column" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('rooms_tab.cols_label')}</Label>
                                            <Input 
                                                id="column" 
                                                type="number"
                                                value={form.column} 
                                                onChange={(e) => setForm(p => ({ ...p, column: e.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {!isAdding && (
                                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border-1 border-amber-200 dark:border-amber-900 rounded-sm">
                                            <p className="text-xs text-amber-800 dark:text-amber-400">
                                                <strong>Note:</strong> {t('rooms_tab.edit_warning')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isCreatingRoom || isUpdatingRoom}
                                    className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-zinc-200 dark:shadow-none disabled:opacity-50 cursor-pointer"
                                >
                                    {isCreatingRoom || isUpdatingRoom ? t('rooms_tab.saving') : t('rooms_tab.save_changes')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}

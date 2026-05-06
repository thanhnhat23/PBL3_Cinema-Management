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
    useDisclosure,
} from "@heroui/react";
import { CalendarIcon, EllipsisVertical, Eye, PenLine, Speech, Trash } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useActorStore, type Actor } from "@/stores/useActorStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";

const columns: AdminColumn[] = [
    { name: "ID", uid: "actor_id", sortable: true },
    { name: "DIỄN VIÊN", uid: "name", sortable: true },
    { name: "GIỚI TÍNH", uid: "gender", sortable: true },
    { name: "NGÀY SINH", uid: "birthday", sortable: true },
    { name: "NƠI SINH", uid: "place_of_birth", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const genderColorMap: Record<string, "primary" | "success" | "default"> = {
    male: "primary",
    female: "success",
    other: "default",
};

const getGenderText = (gender?: number | null) => {
    if (gender === 2) return "Male";
    if (gender === 1) return "Female";
    return "Other";
};

const getAvatarSrc = (profilePath?: string | null) => {
    if (!profilePath) return "https://placehold.co/100x100?text=Actor";
    if (profilePath.startsWith("http://") || profilePath.startsWith("https://")) return profilePath;
    return `https://image.tmdb.org/t/p/original/${profilePath}`;
};

export default function LayoutActors() {
    const {
        actors,
        movieWithActors,
        isFetchingActors,
        fetchAllActors,
        fetchActorById,
        fetchMovieWithActors,
        fetchCharacterWithActors,
        updateActor,
        isUpdatingActor,
    } = useActorStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const popoverContainerRef = useRef<HTMLDivElement | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        gender: "2",
        profile_path: "",
        biography: "",
        birthday: "",
        place_of_birth: "",
    });

    const parseLocalDate = (value?: string) => {
        if (!value) return undefined;

        const [year, month, day] = value.split("-").map(Number);
        if (!year || !month || !day) return undefined;

        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? undefined : date;
    };

    const toDateInputValue = (value?: Date | string | null) => {
        if (!value) return "";

        if (typeof value === "string") {
            const dateOnlyMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
            if (dateOnlyMatch) return dateOnlyMatch[1];
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return format(date, "yyyy-MM-dd");
    };

    const birthdayValue = parseLocalDate(editForm.birthday);

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedActor(null);
        setEditForm({
            name: "",
            gender: "2",
            profile_path: "",
            biography: "",
            birthday: "",
            place_of_birth: "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleOpenEdit = useCallback((actor: Actor) => {
        setIsAdding(false);
        setSelectedActor(actor);
        setEditForm({
            name: actor.name ?? "",
            gender: String(actor.gender ?? 2),
            profile_path: actor.profile_path ?? "",
            biography: actor.biography ?? "",
            birthday: toDateInputValue(actor.birthday),
            place_of_birth: actor.place_of_birth ?? "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSaveActor = async () => {
        const payload = {
            name: editForm.name.trim(),
            gender: Number(editForm.gender),
            profile_path: editForm.profile_path.trim(),
            biography: editForm.biography.trim(),
            birthday: editForm.birthday || null,
            place_of_birth: editForm.place_of_birth.trim(),
        };

        if (isAdding) {
            const { createActor } = useActorStore.getState();
            await createActor(payload);
        } else if (selectedActor) {
            await updateActor(selectedActor.actor_id, payload);
        }

        onEditOpenChange();
    };

    useEffect(() => {
        fetchAllActors();
    }, [fetchAllActors]);

    const renderCell = useCallback((actor: Actor, columnKey: Key) => {
        const cellValue = actor[columnKey as keyof Actor];

        switch (columnKey) {
            case "name":
                return (
                    <User avatarProps={{ radius: "sm", src: getAvatarSrc(actor.profile_path) }} name={actor.name}>
                        {actor.name}
                    </User>
                );
            case "gender": {
                const genderText = getGenderText(actor.gender);
                return (
                    <Chip className="capitalize" color={genderColorMap[genderText.toLowerCase()]} size="sm" variant="flat">
                        {genderText}
                    </Chip>
                );
            }
            case "birthday":
                return actor.birthday ? <span>{toDateInputValue(actor.birthday).split("-").reverse().join("/")}</span> : <span>N/A</span>;
            case "place_of_birth":
                return <span>{actor.place_of_birth ?? "N/A"}</span>;
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
                                onPress={async () => {
                                    await fetchActorById(actor.actor_id);
                                    setSelectedActor(useActorStore.getState().selectedActor);
                                    await Promise.all([
                                        fetchMovieWithActors(actor.actor_id),
                                        fetchCharacterWithActors(actor.actor_id),
                                    ]);
                                    onOpen();
                                }}
                            >
                                Xem
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={18} />}
                                showDivider
                                onPress={() => handleOpenEdit(actor)}
                            >
                                Sửa
                            </DropdownItem>
                            <DropdownItem 
                                key="delete" 
                                startContent={<Trash size={18} />}
                                className="text-danger"
                                color="danger"
                                onPress={() => {
                                    const { deleteActor } = useActorStore.getState();
                                    deleteActor(actor.actor_id);
                                }}
                            >
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [fetchActorById, fetchCharacterWithActors, fetchMovieWithActors, handleOpenEdit, onOpen]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Speech size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Management System
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            Quản lý Diễn viên
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            Quản lý thông tin hồ sơ diễn viên, tiểu sử và danh sách các tác phẩm điện ảnh họ đã tham gia.
                        </p>
                    </div>
                </div>
            </div>
            
            <DataTableAdmin<Actor>
                columns={columns}
                items={actors}
                isLoading={isFetchingActors}
                searchPlaceholder="Tìm theo tên diễn viên..."
                addButtonLabel="Thêm diễn viên"
                onAdd={handleOpenAdd}
                totalLabel={(count) => `Tổng cộng ${count} diễn viên`}
                emptyLabel="Không có diễn viên"
                loadingLabel="Đang tải dữ liệu diễn viên..."
                defaultSort={{ column: "name", direction: "ascending" }}
                rowKey={(item) => item.actor_id}
                searchBy={(item) => item.name}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "gender",
                        name: "Giới tính",
                        options: [
                            { name: "Nam", uid: "2" },
                            { name: "Nữ", uid: "1" },
                            { name: "Khác", uid: "0" },
                        ]
                    }
                ]}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {selectedActor ? `Chi tiết: ${selectedActor.name}` : "Chi tiết diễn viên"}
                            </DrawerHeader>
 
                            <DrawerBody className="px-0">
                                {selectedActor ? (
                                    <div className="flex flex-col gap-0">
                                        <div className="relative w-full h-80 bg-zinc-900 flex justify-center overflow-hidden">
                                            {/* Blurred background */}
                                            <div className="absolute inset-0 opacity-40 blur-2xl scale-110">
                                                <Image
                                                    src={getAvatarSrc(selectedActor.profile_path)}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            
                                            <div className="relative mt-8 w-48 h-64 shadow-2xl rounded-lg overflow-hidden border-2 border-white/10 z-10">
                                                <Image
                                                    src={getAvatarSrc(selectedActor.profile_path)}
                                                    alt={selectedActor.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-sidebar to-transparent z-10" />
                                        </div>

                                        <div className="px-6 -mt-10 relative z-20 flex flex-col gap-6 pb-8">
                                            <div className="flex flex-col gap-2">
                                                <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">{selectedActor.name}</h2>
                                                <div className="flex gap-2 flex-wrap">
                                                    <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none px-2.5 py-0.5 text-[10px] font-bold">ID: {selectedActor.actor_id}</Badge>
                                                    <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] font-bold uppercase">{getGenderText(selectedActor.gender)}</Badge>
                                                    {selectedActor.birthday && (
                                                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] font-medium border-zinc-200 dark:border-zinc-800">
                                                            {new Date(String(selectedActor.birthday)).toLocaleDateString("vi-VN")}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nơi sinh</span>
                                                    <span className="text-sm font-semibold">{selectedActor.place_of_birth ?? "Chưa rõ"}</span>
                                                </div>
                                                
                                                <div className="flex flex-col gap-3">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tiểu sử</span>
                                                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 italic">
                                                        {selectedActor.biography || "Không có dữ liệu tiểu sử cho diễn viên này."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phim đã tham gia</span>
                                                    <Badge variant="outline" className="text-[10px] font-normal">{movieWithActors.length} phim</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {movieWithActors.length > 0 ? (
                                                        movieWithActors.map((item) => (
                                                            <div key={item.Movie?.movie_id} className="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm text-xs font-medium">
                                                                {item.Movie?.title}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-zinc-500">Chưa có dữ liệu.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500 font-medium">Không có dữ liệu diễn viên.</div>
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

            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {isAdding ? "Thêm diễn viên mới" : "Sửa diễn viên"}
                            </DrawerHeader>
                            <DrawerBody>
                                <p className="text-sm text-zinc-500 mb-4">{isAdding ? "Nhập thông tin cho diễn viên mới" : "Thực hiện các thay đổi cho diễn viên"}</p>
 
                                <div ref={popoverContainerRef} className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Họ tên
                                        </Label>
                                        <Input
                                            id="name"
                                            value={editForm.name}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="profile_path" className="text-right">
                                            Profile Path
                                        </Label>
                                        <Input
                                            id="profile_path"
                                            value={editForm.profile_path}
                                            placeholder="/path/to/profile.jpg"
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, profile_path: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="birthday" className="text-right">
                                            Ngày sinh
                                        </Label>

                                        <div className="col-span-3">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        data-empty={!birthdayValue}
                                                        className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-sidebar"
                                                    >
                                                        <CalendarIcon />
                                                        {birthdayValue ? format(birthdayValue, "PPP") : <span>Chọn ngày</span>}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent container={popoverContainerRef.current} className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={birthdayValue}
                                                        onSelect={(selectedDate) => {
                                                            setEditForm((prev) => ({
                                                                ...prev,
                                                                birthday: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                                                            }));
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="place_of_birth" className="text-right">
                                            Nơi sinh
                                        </Label>

                                        <Input
                                            id="place_of_birth"
                                            value={editForm.place_of_birth}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, place_of_birth: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="biography" className="text-right pt-2">
                                            Tiểu sử
                                        </Label>

                                        <Textarea
                                            id="biography"
                                            value={editForm.biography}
                                            placeholder="Nhập tiểu sử diễn viên"
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, biography: event.target.value }))}
                                            className="col-span-3 text-sm min-h-auto"
                                        />
                                    </div>
                                </div>
                            </DrawerBody>

                            <DrawerFooter>
                                <button
                                    type="button"
                                    onClick={handleSaveActor}
                                    disabled={isUpdatingActor}
                                    className="w-full mt-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isUpdatingActor ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

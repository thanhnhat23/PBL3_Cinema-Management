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
    useDisclosure,
} from "@heroui/react";
import { EllipsisVertical, Eye, PenLine, Speech, Trash } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import { useActorStore, type Actor } from "@/stores/useActorStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";

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
        characterWithActors,
        isFetchingActors,
        fetchAllActors,
        fetchMovieWithActors,
        fetchCharacterWithActors,
    } = useActorStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

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
                return actor.birthday ? <span>{new Date(String(actor.birthday)).toLocaleDateString("vi-VN")}</span> : <span>N/A</span>;
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
                                    setSelectedActor(actor);
                                    await Promise.all([
                                        fetchMovieWithActors(actor.actor_id),
                                        fetchCharacterWithActors(actor.actor_id),
                                    ]);
                                    onOpen();
                                }}
                            >
                                Xem
                            </DropdownItem>
                            <DropdownItem key="edit" startContent={<PenLine size={18} />} showDivider>Sửa</DropdownItem>
                            <DropdownItem key="delete" startContent={<Trash size={18} />}>Xóa</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [fetchCharacterWithActors, fetchMovieWithActors, onOpen]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Speech />
                Dashboard: Quản lí diễn viên
            </h1>

            <DataTableAdmin<Actor>
                columns={columns}
                items={actors}
                isLoading={isFetchingActors}
                searchPlaceholder="Tìm theo tên diễn viên..."
                addButtonLabel="Thêm diễn viên"
                totalLabel={(count) => `Tổng cộng ${count} diễn viên`}
                emptyLabel="Không có diễn viên"
                loadingLabel="Đang tải dữ liệu diễn viên..."
                defaultSort={{ column: "name", direction: "ascending" }}
                rowKey={(item) => item.actor_id}
                searchBy={(item) => item.name}
                renderCell={renderCell}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {selectedActor ? `Chi tiết: ${selectedActor.name}` : "Chi tiết diễn viên"}
                            </DrawerHeader>

                            <DrawerBody>
                                {selectedActor ? (
                                    <div className="flex flex-col gap-3 justify-center items-start">
                                        <Image
                                            src={getAvatarSrc(selectedActor.profile_path)}
                                            alt={selectedActor.name}
                                            width={1000}
                                            height={1000}
                                            className="w-56 h-96 rounded-sm border-1 border-zinc-800 object-cover self-center"
                                        />

                                        <div className="flex flex-col gap-2 mt-2">
                                            <p className="font-semibold text-3xl">{selectedActor.name}</p>

                                            <div className="flex gap-2 flex-wrap">
                                                <Badge>
                                                    {selectedActor.actor_id}
                                                </Badge>

                                                <Badge variant={"secondary"}>
                                                    {getGenderText(selectedActor.gender)}
                                                </Badge>

                                                <Badge variant={"outline"}>
                                                    {selectedActor.birthday
                                                        ? new Date(String(selectedActor.birthday)).toLocaleDateString("vi-VN")
                                                        : "N/A"}
                                                </Badge>

                                                <Badge variant={"outline"}>
                                                    {movieWithActors.length} phim
                                                </Badge>
                                            </div>

                                            <p>
                                                <span className="font-semibold">Nơi sinh:</span>{" "}
                                                {selectedActor.place_of_birth ?? "N/A"}
                                            </p>

                                            <p>
                                                <span className="font-semibold">Tiểu sử:</span> {" "}
                                                {selectedActor.biography == "" ? "N/A" : selectedActor.biography}
                                            </p>

                                            <div className="space-y-1">
                                                <p className="font-semibold">Phim đã tham gia:</p>
                                                {movieWithActors.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {movieWithActors.map((item) => (
                                                            <Badge key={`${selectedActor.actor_id}-${item.Movie?.movie_id ?? item.Movie?.title ?? "movie"}`} variant={"secondary"}>
                                                                {item.Movie?.title ?? "N/A"}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-zinc-500">Chưa có dữ liệu phim tham gia.</p>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <p className="font-semibold">Vai diễn:</p>
                                                {characterWithActors.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {characterWithActors.map((item, index) => (
                                                            <Badge key={`${selectedActor.actor_id}-${item.char_name ?? "character"}-${index}`} variant={"outline"}>
                                                                {item.char_name ?? "N/A"}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-zinc-500">Chưa có dữ liệu vai diễn.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>Không có dữ liệu diễn viên.</p>
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

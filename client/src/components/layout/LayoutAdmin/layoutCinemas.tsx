import type { Key } from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import {
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
import { EllipsisVertical, Eye, House, PenLine, Trash } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useCinemaStore, type Cinema } from "@/stores/useCinemaStore";
import { useLocationStore } from "@/stores/useLocationStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";

const columns: AdminColumn[] = [
    { name: "ID", uid: "cinema_id", sortable: true },
    { name: "TÊN RẠP", uid: "name", sortable: true },
    { name: "ĐỊA CHỈ", uid: "address", sortable: true },
    { name: "THÀNH PHỐ", uid: "location", sortable: true },
    { name: "SỐ ĐIỆN THOẠI", uid: "phone_number", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function LayoutCinemas() {
    const { cinemas, isFetchingCinemas, fetchAllCinemas, isUpdatingCinema, updateCinema } = useCinemaStore();
    const { locations, fetchAllLocations } = useLocationStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);
    const [editForm, setEditForm] = useState({
        location_id: "",
        name: "",
        address: "",
        phone_number: "",
        latitude: "",
        longitude: "",
        description: "",
        image_overview: "",
    });

    const handleOpenEdit = useCallback((cinema: Cinema) => {
        setSelectedCinema(cinema);
        setEditForm({
            location_id: String(cinema.location_id ?? ""),
            name: cinema.name ?? "",
            address: cinema.address ?? "",
            phone_number: cinema.phone_number ?? "",
            latitude: String(cinema.latitude ?? ""),
            longitude: String(cinema.longitude ?? ""),
            description: cinema.description ?? "",
            image_overview: cinema.image_overview ?? "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSaveCinema = async () => {
        if (!selectedCinema) return;

        await updateCinema(selectedCinema.cinema_id, {
            location_id: Number(editForm.location_id),
            name: editForm.name.trim(),
            address: editForm.address.trim(),
            phone_number: editForm.phone_number.trim(),
            latitude: Number(editForm.latitude),
            longitude: Number(editForm.longitude),
            description: editForm.description.trim(),
            image_overview: editForm.image_overview.trim(),
        });

        onEditOpenChange();
    };

    useEffect(() => {
        fetchAllCinemas();
        fetchAllLocations();
    }, [fetchAllCinemas, fetchAllLocations]);

    const renderCell = useCallback((cinema: Cinema, columnKey: Key) => {
        const cellValue = cinema[columnKey as keyof Cinema];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: "sm",
                            src: cinema.image_overview || "https://placehold.co/100x100?text=Cinema",
                        }}
                        name={cinema.name}
                    >
                        {cinema.name}
                    </User>
                );
            case "address":
                return <span className="text-sm">{cinema.address}</span>;
            case "location":
                return <span>{cinema.location?.city ?? "N/A"}</span>;
            case "phone_number":
                return <span>{cinema.phone_number}</span>;
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
                                    setSelectedCinema(cinema);
                                    onOpen();
                                }}
                            >
                                Xem
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(cinema)}
                            >
                                Sửa
                            </DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={16} />}>
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [handleOpenEdit, onOpen]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <House />
                Dashboard: Quản lí rạp phim
            </h1>

            <DataTableAdmin<Cinema>
                columns={columns}
                items={cinemas}
                isLoading={isFetchingCinemas}
                searchPlaceholder="Tìm theo tên rạp..."
                addButtonLabel="Thêm rạp phim"
                totalLabel={(count) => `Tổng cộng ${count} rạp phim`}
                emptyLabel="Không có rạp phim"
                loadingLabel="Đang tải dữ liệu rạp phim..."
                defaultSort={{ column: "name", direction: "ascending" }}
                rowKey={(item) => item.cinema_id}
                searchBy={(item) => item.name}
                renderCell={renderCell}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {selectedCinema ? `Chi tiết: ${selectedCinema.name}` : "Chi tiết rạp phim"}
                            </DrawerHeader>

                            <DrawerBody>
                                {selectedCinema ? (
                                    <div className="flex flex-col gap-3 justify-center items-center">
                                        <Image
                                            src={selectedCinema.image_overview || "https://placehold.co/300x600?text=Cinema"}
                                            alt={selectedCinema.name}
                                            width={1000}
                                            height={1000}
                                            className="w-full h-96 rounded-sm border-1 border-zinc-800 object-cover"
                                        />

                                        <div className="flex flex-col gap-2 mt-2">
                                            <p className="font-semibold text-3xl">{selectedCinema.name}</p>

                                            <div className="flex gap-2 flex-wrap">
                                                <Badge>
                                                    {selectedCinema.cinema_id}
                                                </Badge>

                                                <Badge variant={"secondary"}>
                                                    {selectedCinema.location?.city ?? "N/A"}
                                                </Badge>

                                                <Badge variant={"outline"}>
                                                    {selectedCinema.phone_number || "N/A"}
                                                </Badge>
                                            </div>

                                            <p>
                                                {selectedCinema.address}
                                            </p>

                                            {selectedCinema.description ? (
                                                <p>
                                                    <span className="font-semibold">Mô tả:</span>
                                                    <br />
                                                    {selectedCinema.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : (
                                    <p>Không có dữ liệu rạp phim.</p>
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
                                Sửa rạp phim
                            </DrawerHeader>

                            <DrawerBody>
                                <p className="text-sm text-zinc-500">Thực hiện các thay đổi cho rạp phim</p>

                                <div ref={drawerContainerRef} className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Tên rạp
                                        </Label>

                                        <Input
                                            id="name"
                                            value={editForm.name}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="location_id" className="text-right">
                                            Thành phố
                                        </Label>

                                        <Select
                                            value={editForm.location_id}
                                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, location_id: value }))}
                                        >
                                            <SelectTrigger className="col-span-3 w-full bg-sidebar">
                                                <SelectValue placeholder="Chọn thành phố" />
                                            </SelectTrigger>

                                            <SelectContent container={drawerContainerRef.current}>
                                                <SelectGroup>
                                                    <SelectLabel>Danh sách thành phố</SelectLabel>
                                                    {locations.map((location) => (
                                                        <SelectItem key={location.location_id} value={String(location.location_id)}>
                                                            {location.city}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="address" className="text-right">
                                            Địa chỉ
                                        </Label>

                                        <Input
                                            id="address"
                                            value={editForm.address}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phone_number" className="text-right">
                                            Số điện thoại
                                        </Label>

                                        <Input
                                            id="phone_number"
                                            value={editForm.phone_number}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, phone_number: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="latitude" className="text-right">
                                            Vĩ độ
                                        </Label>

                                        <Input
                                            id="latitude"
                                            type="number"
                                            value={editForm.latitude}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, latitude: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="longitude" className="text-right">
                                            Kinh độ
                                        </Label>

                                        <Input
                                            id="longitude"
                                            type="number"
                                            value={editForm.longitude}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, longitude: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="description" className="text-right pt-2">
                                            Mô tả
                                        </Label>

                                        <Textarea
                                            id="description"
                                            value={editForm.description}
                                            placeholder="Nhập mô tả rạp phim"
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
                                            className="col-span-3 text-sm min-h-auto"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="image_overview" className="text-right">
                                            Ảnh mô tả
                                        </Label>

                                        <Input
                                            id="image_overview"
                                            value={editForm.image_overview}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, image_overview: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>
                                </div>
                            </DrawerBody>

                            <DrawerFooter>
                                <button
                                    type="button"
                                    onClick={handleSaveCinema}
                                    disabled={isUpdatingCinema}
                                    className="dark:text-black text-white font-semibold border-1 border-zinc-200 dark:border-neutral-200 rounded-sm px-4 py-2 bg-neutral-800 dark:bg-neutral-100 shadow-[0_0_4px_#ffffff] cursor-pointer"
                                >
                                    {isUpdatingCinema ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

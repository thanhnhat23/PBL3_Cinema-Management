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
import { EllipsisVertical, Eye, Hamburger, PenLine, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

import { useSnackStore, type Snack } from "@/stores/useSnackStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";
import Image from "next/image";

const columns: AdminColumn[] = [
    { name: "ID", uid: "snack_id", sortable: true },
    { name: "TÊN ĐỒ ĂN VẶT", uid: "name", sortable: true },
    { name: "LOẠI", uid: "type", sortable: true },
    { name: "GIÁ", uid: "price", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const snackTypeColorMap: Record<string, "primary" | "success" | "warning"> = {
    food: "primary",
    drink: "success",
    combo: "warning",
};

const getSnackTypeText = (type: number) => {
    switch (type) {
        case 0:
            return "Food";
        case 1:
            return "Drink";
        case 2:
            return "Combo";
        default:
            return "Unknown";
    }
};

export default function LayoutFood() {
    const { snacks, isFetchingSnacks, fetchAllSnacks, updateSnack, isUpdatingSnack } = useSnackStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        type: "0",
        price: "",
        imageUrl: "",
    });

    const handleOpenEdit = useCallback((snack: Snack) => {
        setSelectedSnack(snack);
        setEditForm({
            name: snack.name ?? "",
            type: String(snack.type ?? 0),
            price: String(snack.price ?? ""),
            imageUrl: snack.imageUrl ?? "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSaveSnack = async () => {
        if (!selectedSnack) return;

        await updateSnack(selectedSnack.snack_id, {
            name: editForm.name.trim(),
            type: Number(editForm.type) as Snack["type"],
            price: Number(editForm.price),
            imageUrl: editForm.imageUrl.trim() || null,
        });

        onEditOpenChange();
    };

    useEffect(() => {
        fetchAllSnacks();
    }, [fetchAllSnacks]);

    const renderCell = useCallback((snack: Snack, columnKey: Key) => {
        const cellValue = snack[columnKey as keyof Snack];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex gap-3 items-center">
                        <Image 
                            src={snack.imageUrl || "https://placehold.co/100x100?text=Snack"}
                            alt={snack.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover"
                        />

                        <span className="font-semibold">{snack.name}</span>
                    </div>
                );
            case "type": {
                const typeText = getSnackTypeText(snack.type);
                return (
                    <Chip className="capitalize" color={snackTypeColorMap[typeText.toLowerCase()]} size="sm" variant="flat">
                        {typeText}
                    </Chip>
                );
            }
            case "price":
                return <span>{snack.price.toFixed(0)}vnđ</span>;
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
                                    setSelectedSnack(snack);
                                    onOpen();
                                }}
                            >
                                Xem
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(snack)}
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
                <Hamburger />
                Dashboard: Quản lí thức ăn
            </h1>

            <DataTableAdmin<Snack>
                columns={columns}
                items={snacks}
                isLoading={isFetchingSnacks}
                searchPlaceholder="Tìm theo tên món..."
                addButtonLabel="Thêm món"
                totalLabel={(count) => `Tổng cộng ${count} món`}
                emptyLabel="Không có đồ ăn"
                loadingLabel="Đang tải dữ liệu đồ ăn..."
                defaultSort={{ column: "name", direction: "ascending" }}
                rowKey={(item) => item.snack_id}
                searchBy={(item) => item.name}
                renderCell={renderCell}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                {selectedSnack ? `Chi tiết: ${selectedSnack.name}` : "Chi tiết đồ ăn"}
                            </DrawerHeader>

                            <DrawerBody>
                                {selectedSnack ? (
                                    <div className="flex flex-col gap-3 justify-center items-center">
                                        <Image
                                            src={selectedSnack.imageUrl || "https://placehold.co/300x600?text=Snack"}
                                            alt={selectedSnack.name}
                                            width={300}
                                            height={300}
                                            className="w-full object-cover"
                                        />

                                        <div className="flex flex-col gap-2 mt-2 items-center">
                                            <p className="font-semibold text-3xl">{selectedSnack.name}</p>

                                            <div className="flex gap-2 flex-wrap">
                                                <Badge>
                                                    {selectedSnack.snack_id}
                                                </Badge>

                                                <Badge variant={"secondary"}>
                                                    {getSnackTypeText(selectedSnack.type)}
                                                </Badge>
                                            </div>

                                            <p>
                                                <span className="font-semibold">Mệnh giá: </span>
                                                {selectedSnack.price.toFixed(0)} vnđ
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p>Không có dữ liệu đồ ăn.</p>
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
                                Sửa đồ ăn
                            </DrawerHeader>

                            <DrawerBody>
                                <p className="text-sm text-zinc-500">Thực hiện các thay đổi cho món ăn</p>

                                <div ref={drawerContainerRef} className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Tên món
                                        </Label>

                                        <Input
                                            id="name"
                                            value={editForm.name}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">
                                            Loại
                                        </Label>

                                        <Select
                                            value={editForm.type}
                                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, type: value }))}
                                        >
                                            <SelectTrigger className="col-span-3 w-full bg-sidebar">
                                                <SelectValue placeholder="Chọn loại" />
                                            </SelectTrigger>

                                            <SelectContent container={drawerContainerRef.current}>
                                                <SelectGroup>
                                                    <SelectLabel>Loại đồ ăn</SelectLabel>
                                                    <SelectItem value="0">Food</SelectItem>
                                                    <SelectItem value="1">Drink</SelectItem>
                                                    <SelectItem value="2">Combo</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="text-right">
                                            Giá
                                        </Label>

                                        <Input
                                            id="price"
                                            type="number"
                                            value={editForm.price}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="imageUrl" className="text-right">
                                            Ảnh
                                        </Label>

                                        <Input
                                            id="imageUrl"
                                            value={editForm.imageUrl}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                                            className="col-span-3 bg-sidebar"
                                        />
                                    </div>
                                </div>
                            </DrawerBody>

                            <DrawerFooter>
                                <button
                                    type="button"
                                    onClick={handleSaveSnack}
                                    disabled={isUpdatingSnack}
                                    className="dark:text-black text-white font-semibold border-1 border-zinc-200 dark:border-neutral-200 rounded-sm px-4 py-2 bg-neutral-800 dark:bg-neutral-100 shadow-[0_0_4px_#ffffff] cursor-pointer"
                                >
                                    {isUpdatingSnack ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}
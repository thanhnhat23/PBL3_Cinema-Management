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
import { EllipsisVertical, Eye, Hamburger, PenLine, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    const { snacks, isFetchingSnacks, fetchAllSnacks } = useSnackStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);

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
                            <DropdownItem key="edit" startContent={<PenLine size={16} />}>Sửa</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={16} />}>
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [onOpen]);

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
        </div>
    )
}
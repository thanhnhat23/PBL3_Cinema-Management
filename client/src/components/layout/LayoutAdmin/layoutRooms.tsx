import type { Key } from "react";

import { useCallback, useEffect } from "react";
import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { DoorOpen, EllipsisVertical, Eye, PenLine, Trash } from "lucide-react";

import { useRoomStore, type Room } from "@/stores/useRoomStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";

const columns: AdminColumn[] = [
    { name: "ID", uid: "room_id", sortable: true },
    { name: "TÊN PHÒNG", uid: "nameRoom", sortable: true },
    { name: "RẠP PHIM", uid: "cinema", sortable: true },
    { name: "LOẠI PHÒNG", uid: "roomLayoutType", sortable: true },
    { name: "GIÁ", uid: "price", sortable: true },
    { name: "HÀNG/CỘT", uid: "row", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const roomLayoutTypeColorMap: Record<string, "primary" | "success" | "warning" | "danger"> = {
    standard: "primary",
    imax: "success",
    "4dx": "warning",
    "3d": "danger",
};

const getRoomLayoutTypeText = (type: number) => {
    switch (type) {
        case 0:
            return "Standard";
        case 1:
            return "IMAX";
        case 2:
            return "4DX";
        case 3:
            return "3D";
        default:
            return "Unknown";
    }
};

export default function LayoutRooms() {
    const { rooms, isFetchingRooms, fetchAllRooms } = useRoomStore();

    useEffect(() => {
        fetchAllRooms();
    }, [fetchAllRooms]);

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
                return <span>${room.price.toFixed(2)}</span>;
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
                            <DropdownItem key="view" startContent={<Eye size={16} />}>Xem</DropdownItem>
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
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <DoorOpen />
                Dashboard: Quản lí phòng chiếu
            </h1>

            <DataTableAdmin<Room>
                columns={columns}
                items={rooms}
                isLoading={isFetchingRooms}
                searchPlaceholder="Tìm theo tên phòng..."
                addButtonLabel="Thêm phòng"
                totalLabel={(count) => `Tổng cộng ${count} phòng chiếu`}
                emptyLabel="Không có phòng chiếu"
                loadingLabel="Đang tải dữ liệu phòng chiếu..."
                defaultSort={{ column: "nameRoom", direction: "ascending" }}
                rowKey={(item) => item.room_id}
                searchBy={(item) => item.nameRoom}
                renderCell={renderCell}
            />
        </div>
    )
}

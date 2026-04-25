import type { Key } from "react";

import { useCallback, useEffect } from "react";
import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { EllipsisVertical, Eye, PenLine, Trash, User } from "lucide-react";

import { useBookingStore, type Booking } from "@/stores/useBookingStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";

const columns: AdminColumn[] = [
    { name: "ID", uid: "booking_id", sortable: true },
    { name: "NGƯỜI DÙNG", uid: "userName", sortable: true },
    { name: "RẠP PHIM", uid: "cinemaName", sortable: true },
    { name: "TỔNG TIỀN", uid: "totalAmount", sortable: true },
    { name: "THÀNH TIỀN", uid: "finalAmount", sortable: true },
    { name: "TRẠNG THÁI", uid: "status", sortable: true },
    { name: "NGÀY TẠO", uid: "createAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, "warning" | "success" | "danger" | "default"> = {
    pending: "warning",
    confirmed: "success",
    cancelled: "danger",
    unknown: "default",
};

const getStatusLabel = (status: string) => {
    const normalized = String(status ?? "").toLowerCase();
    if (normalized === "pending" || normalized === "0") return "Pending";
    if (normalized === "confirmed" || normalized === "1") return "Confirmed";
    if (normalized === "cancelled" || normalized === "2") return "Cancelled";
    return "Unknown";
};

export default function LayoutTickets() {
    const { bookings, isFetchingBookings, fetchAllBookings } = useBookingStore();

    useEffect(() => {
        fetchAllBookings();
    }, [fetchAllBookings]);

    const renderCell = useCallback((booking: Booking, columnKey: Key) => {
        const cellValue = booking[columnKey as keyof Booking];

        switch (columnKey) {
            case "userName":
                return <span className="font-semibold">{booking.userName ?? "N/A"}</span>;
            case "cinemaName":
                return <span>{booking.cinemaName ?? "N/A"}</span>;
            case "totalAmount":
                return <span>{Number(booking.totalAmount ?? 0).toLocaleString("vi-VN")} đ</span>;
            case "finalAmount":
                return <span className="font-semibold">{Number(booking.finalAmount ?? 0).toLocaleString("vi-VN")} đ</span>;
            case "status": {
                const label = getStatusLabel(String(booking.status));
                return (
                    <Chip className="capitalize" color={statusColorMap[label.toLowerCase()] ?? "default"} size="sm" variant="flat">
                        {label}
                    </Chip>
                );
            }
            case "createAt":
                return <span>{new Date(String(booking.createAt)).toLocaleDateString("vi-VN")}</span>;
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
                            <DropdownItem key="view" startContent={<Eye size={18} />}>
                                Xem
                            </DropdownItem>
                            <DropdownItem key="edit" startContent={<PenLine size={18} />} showDivider>
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
    }, []);

    return (
        <>
            <DataTableAdmin<Booking>
                columns={columns}
                items={bookings}
                isLoading={isFetchingBookings}
                searchPlaceholder="Tìm theo tên người dùng..."
                addButtonLabel="Thêm vé"
                totalLabel={(count) => `Tổng cộng ${count} vé`}
                emptyLabel="Không có vé"
                loadingLabel="Đang tải dữ liệu vé..."
                defaultSort={{ column: "createAt", direction: "descending" }}
                rowKey={(item) => item.booking_id}
                searchBy={(item) => String(item.userName ?? "")}
                renderCell={renderCell}
            />
        </>
    )
}

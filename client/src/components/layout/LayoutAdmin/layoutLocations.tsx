import type { Key } from "react";

import { useCallback, useEffect } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { EllipsisVertical, Eye, MapPin, PenLine, Trash } from "lucide-react";

import { useLocationStore, type Location } from "@/stores/useLocationStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";

const columns: AdminColumn[] = [
    { name: "ID", uid: "location_id", sortable: true },
    { name: "THÀNH PHỐ", uid: "city", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function LayoutLocations() {
    const { locations, isFetchingLocations, fetchAllLocations } = useLocationStore();

    useEffect(() => {
        fetchAllLocations();
    }, [fetchAllLocations]);

    const renderCell = useCallback((location: Location, columnKey: Key) => {
        const cellValue = location[columnKey as keyof Location];

        switch (columnKey) {
            case "city":
                return <span className="font-semibold">{location.city}</span>;
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
                <MapPin />
                Dashboard: Quản lí địa điểm
            </h1>

            <DataTableAdmin<Location>
                columns={columns}
                items={locations}
                isLoading={isFetchingLocations}
                searchPlaceholder="Tìm kiếm thành phố..."
                addButtonLabel="Thêm địa điểm"
                totalLabel={(count) => `Tổng cộng ${count} địa điểm`}
                emptyLabel="Không có địa điểm"
                loadingLabel="Đang tải dữ liệu địa điểm..."
                defaultSort={{ column: "city", direction: "ascending" }}
                rowKey={(item) => item.location_id}
                searchBy={(item) => item.city}
                renderCell={renderCell}
            />
        </div>
    )
}

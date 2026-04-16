import type { Key } from "react";

import { useCallback, useEffect, useState } from "react";
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

import { useCinemaStore, type Cinema } from "@/stores/useCinemaStore";
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
    const { cinemas, isFetchingCinemas, fetchAllCinemas } = useCinemaStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);

    useEffect(() => {
        fetchAllCinemas();
    }, [fetchAllCinemas]);

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
                            <DropdownItem key="edit" startContent={<PenLine size={16} />}>Edit</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={16} />}>
                                Delete
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
        </div>
    )
}

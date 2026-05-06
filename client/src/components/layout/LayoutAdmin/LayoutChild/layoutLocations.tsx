import type { Key } from "react";

import { useCallback, useEffect, useState } from "react";
import { 
    Dropdown, 
    DropdownItem, 
    DropdownMenu, 
    DropdownTrigger,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
} from "@heroui/react";
import { Badge } from "@/components/ui/badge";
import { EllipsisVertical, Eye, MapPin, PenLine, Trash, Building2 } from "lucide-react";

import { useLocationStore, type Location } from "@/stores/useLocationStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: AdminColumn[] = [
    { name: "ID", uid: "location_id", sortable: true },
    { name: "THÀNH PHỐ", uid: "city", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function LayoutLocations() {
    const { 
        locations, 
        isFetchingLocations, 
        fetchAllLocations, 
        createLocation, 
        updateLocation, 
        deleteLocation,
        isCreatingLocation,
        isUpdatingLocation
    } = useLocationStore();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({ city: "" });

    useEffect(() => {
        fetchAllLocations();
    }, [fetchAllLocations]);

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedLocation(null);
        setForm({ city: "" });
        onEditOpen();
    }, [onEditOpen]);

    const handleOpenEdit = useCallback((location: Location) => {
        setIsAdding(false);
        setSelectedLocation(location);
        setForm({ city: location.city });
        onEditOpen();
    }, [onEditOpen]);

    const handleSave = useCallback(async () => {
        if (!form.city.trim()) return;

        if (isAdding) {
            await createLocation({ city: form.city.trim() });
        } else if (selectedLocation) {
            await updateLocation(selectedLocation.location_id, { city: form.city.trim() });
        }
        onEditOpenChange();
    }, [isAdding, form.city, selectedLocation, createLocation, updateLocation, onEditOpenChange]);

    const renderCell = useCallback((location: Location, columnKey: Key) => {
        const cellValue = location[columnKey as keyof Location];

        switch (columnKey) {
            case "city":
                return (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
                            <MapPin size={14} />
                        </div>
                        <span className="font-semibold">{location.city}</span>
                    </div>
                );
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
                                    setSelectedLocation(location);
                                    onOpen();
                                }}
                            >
                                Xem
                            </DropdownItem>
                            <DropdownItem 
                                key="edit" 
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(location)}
                            >
                                Sửa
                            </DropdownItem>
                            <DropdownItem 
                                key="delete" 
                                className="text-danger" 
                                color="danger" 
                                startContent={<Trash size={16} />}
                                onPress={() => deleteLocation(location.location_id)}
                            >
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [deleteLocation, onOpen, handleOpenEdit]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <MapPin size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Management System
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            Quản lý Khu vực & Địa điểm
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            Cấu hình danh sách các tỉnh thành và địa điểm rạp phim để khách hàng dễ dàng tra cứu và đặt vé.
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Location>
                columns={columns}
                items={locations}
                isLoading={isFetchingLocations}
                searchPlaceholder="Tìm kiếm thành phố..."
                addButtonLabel="Thêm địa điểm"
                onAdd={handleOpenAdd}
                totalLabel={(count) => `Tổng cộng ${count} địa điểm`}
                emptyLabel="Không có địa điểm"
                loadingLabel="Đang tải dữ liệu địa điểm..."
                defaultSort={{ column: "city", direction: "ascending" }}
                rowKey={(item) => item.location_id}
                searchBy={(item) => item.city}
                renderCell={renderCell}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                Chi tiết địa điểm
                            </DrawerHeader>
                            <DrawerBody className="py-8">
                                {selectedLocation ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                                            <Building2 size={48} />
                                        </div>
                                        <div className="text-center flex flex-col gap-2">
                                            <h2 className="text-3xl font-bold tracking-tight">{selectedLocation.city}</h2>
                                            <div className="flex justify-center">
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-zinc-200 dark:border-zinc-800">
                                                    ID: {selectedLocation.location_id}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Hệ thống quản lý</span>
                                            <p className="text-sm text-zinc-500 text-center">Địa điểm này hiện đang được sử dụng để phân loại các cụm rạp trên toàn quốc.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500">Không có dữ liệu.</div>
                                )}
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader>
                                {isAdding ? "Thêm địa điểm mới" : "Sửa địa điểm"}
                            </DrawerHeader>
                            <DrawerBody>
                                <div className="flex flex-col gap-4 py-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="city">Tên thành phố</Label>
                                        <Input 
                                            id="city" 
                                            value={form.city}
                                            onChange={(e) => setForm({ city: e.target.value })}
                                            placeholder="VD: Hồ Chí Minh, Hà Nội..."
                                            className="bg-sidebar"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isCreatingLocation || isUpdatingLocation}
                                        className="w-full mt-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isCreatingLocation || isUpdatingLocation ? "Đang lưu..." : "Lưu thay đổi"}
                                    </button>
                                </div>
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

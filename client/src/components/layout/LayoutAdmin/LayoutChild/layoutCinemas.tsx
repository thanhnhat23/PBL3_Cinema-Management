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
import { EllipsisVertical, Eye, MapPinHouse, PenLine, Trash } from "lucide-react";
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
import { useTranslation } from "react-i18next";
import { useCinemaStore, type Cinema } from "@/stores/useCinemaStore";
import { useLocationStore } from "@/stores/useLocationStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";

const getCinemaColumns = (t: any): AdminColumn[] => [
    { name: "ID", uid: "cinema_id", sortable: true },
    { name: t('cinemas_tab.columns.name'), uid: "name", sortable: true },
    { name: t('cinemas_tab.columns.address'), uid: "address", sortable: true },
    { name: t('cinemas_tab.columns.city'), uid: "location", sortable: true },
    { name: t('cinemas_tab.columns.phone'), uid: "phone_number", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

export default function LayoutCinemas() {
    const { t } = useTranslation();
    const { cinemas, isFetchingCinemas, fetchAllCinemas, isUpdatingCinema, updateCinema } = useCinemaStore();
    const { locations, fetchAllLocations } = useLocationStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);
    const [editForm, setEditForm] = useState({
        location_id: "",
        name: "",
        address: "",
        phone_number: "",
        latitude: "10.0",
        longitude: "106.0",
        description: "",
        image_overview: "",
    });

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedCinema(null);
        setEditForm({
            location_id: locations[0]?.location_id ? String(locations[0].location_id) : "",
            name: "",
            address: "",
            phone_number: "",
            latitude: "10.0",
            longitude: "106.0",
            description: "",
            image_overview: "",
        });
        onEditOpen();
    }, [locations, onEditOpen]);

    const handleOpenEdit = useCallback((cinema: Cinema) => {
        setIsAdding(false);
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
        const payload = {
            location_id: Number(editForm.location_id),
            name: editForm.name.trim(),
            address: editForm.address.trim(),
            phone_number: editForm.phone_number.trim(),
            latitude: Number(editForm.latitude),
            longitude: Number(editForm.longitude),
            description: editForm.description.trim(),
            image_overview: editForm.image_overview.trim(),
        };

        if (isAdding) {
            const { createCinema } = useCinemaStore.getState();
            await createCinema(payload);
        } else if (selectedCinema) {
            await updateCinema(selectedCinema.cinema_id, payload);
        }

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
                                {t('common.view')}
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(cinema)}
                            >
                                {t('movie_details.edit_movie')}
                            </DropdownItem>
                             <DropdownItem 
                                key="delete" 
                                className="text-danger" 
                                color="danger" 
                                startContent={<Trash size={16} />}
                                onPress={() => {
                                    const { deleteCinema } = useCinemaStore.getState();
                                    deleteCinema(cinema.cinema_id);
                                }}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [handleOpenEdit, onOpen, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <MapPinHouse size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('cinemas_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('cinemas_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Cinema>
                columns={getCinemaColumns(t)}
                items={cinemas}
                isLoading={isFetchingCinemas}
                searchPlaceholder={t('cinemas_tab.search_placeholder')}
                addButtonLabel={t('cinemas_tab.add_cinema')}
                onAdd={handleOpenAdd}
                totalLabel={(count) => t('cinemas_tab.total_count', { count })}
                emptyLabel={t('cinemas_tab.empty_label')}
                loadingLabel={t('cinemas_tab.loading_label')}
                defaultSort={{ column: "name", direction: "ascending" }}
                rowKey={(item) => item.cinema_id}
                searchBy={(item) => item.name}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "location_id",
                        name: t('cinemas_tab.city_label'),
                        options: locations.map(l => ({ name: l.city, uid: String(l.location_id) }))
                    }
                ]}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {selectedCinema ? t('movie_details.view_details', { title: selectedCinema.name }) : t('cinemas_tab.details_title')}
                            </DrawerHeader>
 
                            <DrawerBody className="px-0">
                                {selectedCinema ? (
                                    <div className="flex flex-col gap-0">
                                        <div className="relative w-full h-64 shadow-inner">
                                            <Image
                                                src={selectedCinema.image_overview || "https://placehold.co/1000x500?text=Cinema+View"}
                                                alt={selectedCinema.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-sidebar via-transparent to-transparent" />
                                        </div>

                                        <div className="px-6 -mt-8 relative z-10 flex flex-col gap-6 pb-8">
                                            <div className="flex flex-col gap-2">
                                                <h2 className="text-3xl font-bold tracking-tight">{selectedCinema.name}</h2>
                                                <div className="flex gap-2 items-center">
                                                    <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none px-2 py-0.5 text-[10px]">ID: {selectedCinema.cinema_id}</Badge>
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none px-2 py-0.5 text-[10px] uppercase font-bold">
                                                        {selectedCinema.location?.city ?? "N/A"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex items-start gap-4 p-4 rounded-xl border-1 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <div className="flex flex-col gap-1 w-full">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('cinemas_tab.address_label')}</span>
                                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-snug">{selectedCinema.address}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-start gap-4 p-4 rounded-xl border-1 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('cinemas_tab.hotline')}</span>
                                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{selectedCinema.phone_number || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4 p-4 rounded-xl border-1 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('cinemas_tab.coordinates')}</span>
                                                            <span className="text-[11px] font-medium text-zinc-500">{selectedCinema.latitude}, {selectedCinema.longitude}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('cinemas_tab.intro_label')}</span>
                                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 italic">
                                                    {selectedCinema.description || t('cinemas_tab.intro_placeholder')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500 font-medium tracking-tight">{t('cinemas_tab.no_data')}</div>
                                )}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button onClick={onClose} className="w-full font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                                    {t('foods_tab.close_details')}
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
                                {isAdding ? t('cinemas_tab.add_new_cinema') : t('cinemas_tab.edit_cinema')}
                            </DrawerHeader>

                            <DrawerBody>
                                <p className="text-sm text-zinc-500">{t('cinemas_tab.edit_desc')}</p>

                                <div ref={drawerContainerRef} className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            {t('cinemas_tab.name_label')}
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
                                            {t('cinemas_tab.city_label')}
                                        </Label>

                                        <Select
                                            value={editForm.location_id}
                                            onValueChange={(value) => setEditForm((prev) => ({ ...prev, location_id: value }))}
                                        >
                                            <SelectTrigger className="col-span-3 w-full bg-sidebar">
                                                <SelectValue placeholder={t('cinemas_tab.city_label')} />
                                            </SelectTrigger>

                                            <SelectContent container={drawerContainerRef.current}>
                                                <SelectGroup>
                                                    <SelectLabel>{t('cinemas_tab.city_label')}</SelectLabel>
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
                                            {t('cinemas_tab.address_label')}
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
                                            {t('cinemas_tab.phone_label')}
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
                                            {t('cinemas_tab.coordinates')} (Lat)
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
                                            {t('cinemas_tab.coordinates')} (Lng)
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
                                            {t('cinemas_tab.intro_label')}
                                        </Label>

                                        <Textarea
                                            id="description"
                                            value={editForm.description}
                                            placeholder={t('cinemas_tab.intro_placeholder')}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
                                            className="col-span-3 text-sm min-h-auto"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="image_overview" className="text-right">
                                            {t('cinemas_tab.image_label')}
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
                                    {isUpdatingCinema ? t('cinemas_tab.saving') : t('cinemas_tab.save_changes')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

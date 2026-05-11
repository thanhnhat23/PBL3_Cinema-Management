'use client';

import type { Key } from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import {
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
import { EllipsisVertical, PenLine, Warehouse, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useInventoryStore, type Inventory } from "@/stores/useInventoryStore";
import { useSnackStore } from "@/stores/useSnackStore";
import { useCinemaStore } from "@/stores/useCinemaStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { Badge } from "@/components/ui/badge";

const getColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: t('cinemas_tab.name_label'), uid: "cinema_name", sortable: true },
    { name: t('foods_tab.name_label'), uid: "snack_name", sortable: true },
    { name: t('inventory_tab.quantity_label') || "Quantity", uid: "quantity", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

export default function LayoutInventory() {
    const { t } = useTranslation();
    const {
        inventories,
        isFetchingInventories,
        fetchAllInventories,
        createInventory,
        updateInventory,
    } = useInventoryStore();
    const { snacks, fetchAllSnacks } = useSnackStore();
    const { cinemas, fetchAllCinemas } = useCinemaStore();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenView, onOpen: onOpenView, onOpenChange: onOpenChangeView } = useDisclosure();
    
    const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);

    const [form, setForm] = useState({
        cinema_id: "",
        snack_id: "",
        quantity: "0",
    });

    useEffect(() => {
        fetchAllInventories();
        fetchAllSnacks();
        fetchAllCinemas();
    }, [fetchAllInventories, fetchAllSnacks, fetchAllCinemas]);

    const handleOpenAdd = () => {
        setIsAdding(true);
        setSelectedItem(null);
        setForm({ cinema_id: "", snack_id: "", quantity: "0" });
        onOpen();
    };

    const handleOpenEdit = useCallback((item: Inventory) => {
        setIsAdding(false);
        setSelectedItem(item);
        setForm({
            cinema_id: String(item.cinema_id),
            snack_id: String(item.snack_id),
            quantity: String(item.quantity),
        });
        onOpen();
    }, [onOpen]);

    const handleOpenView = useCallback((item: Inventory) => {
        setSelectedItem(item);
        onOpenView();
    }, [onOpenView]);

    const handleSave = async () => {
        const data = {
            cinema_id: Number(form.cinema_id),
            snack_id: Number(form.snack_id),
            quantity: Number(form.quantity),
        };

        if (isAdding) {
            await createInventory(data);
        } else if (selectedItem) {
            await updateInventory(selectedItem.cinema_id, selectedItem.snack_id, { quantity: data.quantity });
        }
        await fetchAllInventories();
        onOpenChange();
    };

    const renderCell = useCallback((item: Inventory, columnKey: Key) => {
        switch (columnKey) {
            case "cinema_name":
                return <span className="font-medium text-zinc-700 dark:text-zinc-200">{cinemas.find(c => c.cinema_id === item.cinema_id)?.name || "Unknown"}</span>;
            case "snack_name":
                return <span className="font-medium text-zinc-700 dark:text-zinc-200">{snacks.find(s => s.snack_id === item.snack_id)?.name || "Unknown"}</span>;
            case "quantity":
                return <span className="font-bold text-amber-600 dark:text-amber-400">{item.quantity}</span>;
            case "actions":
                return (
                    <Dropdown classNames={{ content: "bg-sidebar shadow-lg border-1 border-zinc-200 dark:border-zinc-800" }}>
                        <DropdownTrigger>
                            <button className="p-2 rounded-sm hover:border-1 hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-sidebar cursor-pointer outline-none">
                                <EllipsisVertical size={18} />
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key="view"
                                startContent={<Eye size={16} />}
                                onPress={() => handleOpenView(item)}
                            >
                                {t('common.view')}
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(item)}
                            >
                                {t('common.edit')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return "";
        }
    }, [cinemas, snacks, handleOpenEdit, handleOpenView, t]);

    return (
        <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Warehouse size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('inventory_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('inventory_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>

            <DataTableAdmin<Inventory>
                columns={getColumns(t)}
                items={inventories}
                isLoading={isFetchingInventories}
                searchPlaceholder={t('inventory_tab.search_placeholder')}
                addButtonLabel={t('inventory_tab.add_label')}
                onAdd={handleOpenAdd}
                totalLabel={(count) => t('inventory_tab.total_items', { count })}
                emptyLabel={t('foods_tab.empty_label')}
                loadingLabel={t('foods_tab.loading_label')}
                defaultSort={{ column: "cinema_name", direction: "ascending" }}
                rowKey={(item) => `${item.cinema_id}-${item.snack_id}`}
                searchBy={(item) => {
                    const cinema = cinemas.find(c => c.cinema_id === item.cinema_id)?.name || "";
                    const snack = snacks.find(s => s.snack_id === item.snack_id)?.name || "";
                    return `${cinema} ${snack}`;
                }}
                renderCell={renderCell}
            />

            {/* View Drawer */}
            <Drawer isOpen={isOpenView} onOpenChange={onOpenChangeView} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-widest text-xs font-black">
                                {t('foods_tab.details_title')}
                            </DrawerHeader>
                            <DrawerBody className="p-0">
                                {selectedItem ? (
                                    <div className="flex flex-col gap-8 p-8">
                                        <div className="flex flex-col gap-2">
                                            <Badge className="w-fit bg-emerald-500 text-white border-none font-bold">
                                                {t('dashboard.management.inventory')}
                                            </Badge>
                                            <h2 className="text-3xl font-black tracking-tight">
                                                {snacks.find(s => s.snack_id === selectedItem.snack_id)?.name || "Unknown Snack"}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-2">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('cinemas_tab.name_label')}</span>
                                                <span className="text-lg font-bold">
                                                    {cinemas.find(c => c.cinema_id === selectedItem.cinema_id)?.name || "Unknown"}
                                                </span>
                                            </div>
                                            <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-2">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('inventory_tab.quantity_label')}</span>
                                                <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                                                    {selectedItem.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button onClick={onClose} className="w-full h-12 border border-zinc-200 dark:border-zinc-800 rounded-lg font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-sm">
                                    {t('common.close')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Edit Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {isAdding ? t('inventory_tab.add_label') : t('inventory_tab.update_quantity')}
                            </DrawerHeader>
                            <DrawerBody>
                                <div ref={drawerContainerRef} className="flex flex-col gap-6 py-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('cinemas_tab.name_label')}</Label>
                                        {isAdding ? (
                                            <Select
                                                value={form.cinema_id}
                                                onValueChange={(val) => setForm(f => ({ ...f, cinema_id: val }))}
                                            >
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                    <SelectValue placeholder={t('booking.selection.select_cinema')} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-sidebar border border-zinc-200 dark:border-zinc-800">
                                                    {cinemas.map(c => (
                                                        <SelectItem key={c.cinema_id} value={String(c.cinema_id)}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span className="block p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-sm font-medium border border-zinc-100 dark:border-zinc-800">
                                                {cinemas.find(c => c.cinema_id === Number(form.cinema_id))?.name || "Unknown"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('foods_tab.name_label')}</Label>
                                        {isAdding ? (
                                            <Select
                                                value={form.snack_id}
                                                onValueChange={(val) => setForm(f => ({ ...f, snack_id: val }))}
                                            >
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                    <SelectValue placeholder={t('foods_tab.type_placeholder')} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-sidebar border border-zinc-200 dark:border-zinc-800">
                                                    {snacks.map(s => (
                                                        <SelectItem key={s.snack_id} value={String(s.snack_id)}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span className="block p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-sm font-medium border border-zinc-100 dark:border-zinc-800">
                                                {snacks.find(s => s.snack_id === Number(form.snack_id))?.name || "Unknown"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('inventory_tab.quantity_label')}</Label>
                                        <Input
                                            type="number"
                                            value={form.quantity}
                                            onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
                                            className="bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    onClick={handleSave}
                                    className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-all shadow-lg"
                                >
                                    {t('common.save')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}

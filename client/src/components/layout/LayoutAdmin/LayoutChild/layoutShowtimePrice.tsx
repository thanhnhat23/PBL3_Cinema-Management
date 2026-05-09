import { Banknote, EllipsisVertical, Eye, PenLine, Trash, Tag, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, type Key, useCallback, useState, useRef } from "react";
import { useShowTimePriceStore, type ShowTimePrice } from "@/stores/useShowTimePriceStore";
import { useShowTimeSlotStore } from "@/stores/useShowTimeSlotStore";
import { useSeatTypeStore } from "@/stores/useSeatTypeStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
    Badge,
} from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: t('showtimes_tab.price_tab.slot_id') || "Slot ID", uid: "slot_id", sortable: true },
    { name: t('showtimes_tab.price_tab.seat_type') || "Seat Type", uid: "type_id", sortable: true },
    { name: t('showtimes_tab.price_tab.base_price'), uid: "base_price", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

export default function LayoutShowtimePrice() {
    const { t } = useTranslation();
    const { prices, isFetching, fetchAll: fetchPrices, deletePrice, updatePrice, createPrice } = useShowTimePriceStore();
    const { slots, fetchAll: fetchSlots } = useShowTimeSlotStore();
    const { seatTypes, fetchAll: fetchSeatTypes } = useSeatTypeStore();
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<ShowTimePrice | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);

    const [editForm, setEditForm] = useState({
        type_id: "",
        slot_id: "",
        base_price: ""
    });

    useEffect(() => {
        fetchPrices();
        fetchSlots();
        fetchSeatTypes();
    }, [fetchPrices, fetchSlots, fetchSeatTypes]);

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedItem(null);
        setEditForm({
            type_id: "",
            slot_id: "",
            base_price: ""
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleOpenEdit = useCallback((item: ShowTimePrice) => {
        setIsAdding(false);
        setSelectedItem(item);
        setEditForm({
            type_id: String(item.type_id),
            slot_id: String(item.slot_id),
            base_price: String(item.base_price)
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSave = async () => {
        const payload = {
            type_id: Number(editForm.type_id),
            slot_id: Number(editForm.slot_id),
            base_price: Number(editForm.base_price)
        };

        if (isAdding) {
            await createPrice(payload);
        } else if (selectedItem) {
            await updatePrice(selectedItem.type_id, selectedItem.slot_id, payload);
        }
        onEditOpenChange();
        fetchPrices();
    };

    const getDayName = useCallback((day: number) => {
        const days = [
            t('common.days.sunday'),
            t('common.days.monday'),
            t('common.days.tuesday'),
            t('common.days.wednesday'),
            t('common.days.thursday'),
            t('common.days.friday'),
            t('common.days.saturday')
        ];
        return days[day] || "Unknown";
    }, [t]);

    const renderCell = useCallback((item: ShowTimePrice, columnKey: Key) => {
        const cellValue = item[columnKey as keyof ShowTimePrice];
        switch (columnKey) {
            case "slot_id":
                const slot = slots.find(s => s.slot_id === item.slot_id);
                return (
                    <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">Slot #{item.slot_id}</span>
                        {slot && <span className="text-[10px] text-zinc-500 font-medium">{getDayName(slot.dayOfWeek)} • {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>}
                    </div>
                );
            case "type_id":
                const type = seatTypes.find(st => st.type_id === item.type_id);
                const typeName = type 
                    ? (typeof type.type_name === 'string' ? type.type_name : (type.type_id === 2 ? t('rooms_tab.seat_couple') : t('rooms_tab.seat_single'))) 
                    : `Type ${item.type_id}`;
                return <Badge variant="flat" color={item.type_id === 2 ? "secondary" : "primary"}>{typeName}</Badge>;
            case "base_price":
                return <span className="font-bold text-emerald-600 dark:text-emerald-400">{Number(cellValue).toLocaleString()} VNĐ</span>;
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
                        <DropdownMenu aria-label="Price Actions">
                            <DropdownItem 
                                key="view" 
                                startContent={<Eye size={16} />}
                                onPress={() => {
                                    setSelectedItem(item);
                                    onOpen();
                                }}
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
                            <DropdownItem 
                                key="delete" 
                                startContent={<Trash size={16} />} 
                                className="text-danger" 
                                color="danger"
                                onPress={() => deletePrice(item.type_id, item.slot_id)}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [deletePrice, handleOpenEdit, onOpen, t, slots, seatTypes, getDayName]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Banknote size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('showtimes_tab.tabs.price')} (Slot-based)
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('showtimes_tab.price_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>

            <DataTableAdmin<ShowTimePrice>
                columns={getColumns(t)}
                items={prices}
                isLoading={isFetching}
                searchPlaceholder={t('showtimes_tab.price_tab.search_placeholder')}
                onAdd={handleOpenAdd}
                addButtonLabel={t('common.add_new')}
                totalLabel={(count) => t('showtimes_tab.total_count', { count })}
                emptyLabel={t('showtimes_tab.empty_label')}
                loadingLabel={t('showtimes_tab.loading_label')}
                defaultSort={{ column: "slot_id", direction: "descending" }}
                rowKey={(item) => `${item.type_id}-${item.slot_id}`}
                searchBy={(item) => String(item.slot_id)}
                renderCell={renderCell}
            />

            {/* View Details Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {t('showtimes_tab.price_tab.details_title')}
                            </DrawerHeader>
                            <DrawerBody>
                                {selectedItem ? (
                                    <div className="flex flex-col gap-6 py-6">
                                        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                                            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500">
                                                <Banknote size={48} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                                    {Number(selectedItem.base_price).toLocaleString()} VNĐ
                                                </h3>
                                                <p className="text-sm text-zinc-500 font-medium mt-1">{t('showtimes_tab.price_tab.slot_specific_price')}</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-3">
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
                                                <div className="flex items-center gap-3">
                                                    <Tag size={16} className="text-zinc-400" />
                                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('showtimes_tab.price_tab.seat_type')}</span>
                                                </div>
                                                <Badge variant="flat" color={selectedItem.type_id === 2 ? "secondary" : "primary"}>
                                                    {(() => {
                                                        const type = seatTypes.find(st => st.type_id === selectedItem.type_id);
                                                        return type 
                                                            ? (typeof type.type_name === 'string' ? type.type_name : (type.type_id === 2 ? t('rooms_tab.seat_couple') : t('rooms_tab.seat_single'))) 
                                                            : `Type ${selectedItem.type_id}`;
                                                    })()}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={16} className="text-zinc-400" />
                                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('showtimes_tab.price_tab.slot_id')}</span>
                                                </div>
                                                <Badge variant="flat">#{selectedItem.slot_id}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500">{t('common.no_data')}</div>
                                )}
                            </DrawerBody>
                            <DrawerFooter>
                                <button onClick={onClose} className="w-full font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                                    {t('common.close')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Edit/Add Drawer */}
            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {isAdding ? t('showtimes_tab.price_tab.add_title') : t('showtimes_tab.price_tab.edit_title')}
                            </DrawerHeader>
                            <DrawerBody>
                                <div ref={drawerContainerRef} className="flex flex-col gap-6 py-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.price_tab.slot_id')}</Label>
                                        <Select
                                            disabled={!isAdding}
                                            value={editForm.slot_id}
                                            onValueChange={(val) => setEditForm(p => ({ ...p, slot_id: val }))}
                                        >
                                            <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                <SelectValue placeholder={t('showtimes_tab.price_tab.select_slot')} />
                                            </SelectTrigger>
                                            <SelectContent container={drawerContainerRef.current} className="bg-sidebar border border-zinc-200 dark:border-zinc-800">
                                                {slots.map(slot => (
                                                    <SelectItem key={slot.slot_id} value={String(slot.slot_id)}>
                                                        Slot #{slot.slot_id} ({getDayName(slot.dayOfWeek)} {slot.startTime.substring(0,5)})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.price_tab.seat_type')}</Label>
                                        <Select
                                            disabled={!isAdding}
                                            value={editForm.type_id}
                                            onValueChange={(val) => setEditForm(p => ({ ...p, type_id: val }))}
                                        >
                                            <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                <SelectValue placeholder={t('showtimes_tab.price_tab.select_seat_type')} />
                                            </SelectTrigger>
                                            <SelectContent container={drawerContainerRef.current} className="bg-sidebar border border-zinc-200 dark:border-zinc-800">
                                                {seatTypes.map(st => (
                                                    <SelectItem key={st.type_id} value={String(st.type_id)}>
                                                        {typeof st.type_name === 'string' ? st.type_name : (st.type_id === 2 ? t('rooms_tab.seat_couple') : t('rooms_tab.seat_single'))}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('showtimes_tab.price_tab.override_price')}</Label>
                                        <Input 
                                            type="number" 
                                            value={editForm.base_price} 
                                            onChange={e => setEditForm(p => ({ ...p, base_price: e.target.value }))}
                                            className="bg-sidebar h-12 rounded-lg"
                                            placeholder={t('showtimes_tab.price_tab.enter_price')}
                                        />
                                    </div>
                                </div>
                            </DrawerBody>
                            <DrawerFooter className="flex gap-2">
                                <button onClick={onClose} className="flex-1 font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                                    {t('common.cancel')}
                                </button>
                                <button onClick={handleSave} className="flex-1 dark:text-black text-white font-bold rounded-lg py-2 bg-neutral-800 dark:bg-neutral-100 cursor-pointer">
                                    {t('common.save')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

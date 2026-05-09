import { Clock, EllipsisVertical, Eye, PenLine, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type Key, useCallback, useState, useRef, useEffect } from "react";
import { useShowTimeSlotStore, type ShowTimeSlot } from "@/stores/useShowTimeSlotStore";
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
    Badge
} from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const getColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: "ID", uid: "slot_id", sortable: true },
    { name: t('showtimes_tab.slot_tab.day_of_week'), uid: "dayOfWeek", sortable: true },
    { name: t('showtimes_tab.slot_tab.start_time'), uid: "startTime", sortable: true },
    { name: t('showtimes_tab.slot_tab.end_time'), uid: "endTime", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

export default function LayoutShowtimeSlot() {
    const { t } = useTranslation();
    const { slots, isFetching, fetchAll, createSlot, updateSlot, deleteSlot } = useShowTimeSlotStore();
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<ShowTimeSlot | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const [editForm, setEditForm] = useState({
        dayOfWeek: "1",
        startTime: "",
        endTime: ""
    });

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedItem(null);
        setEditForm({
            dayOfWeek: "1",
            startTime: "",
            endTime: ""
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleOpenEdit = useCallback((item: ShowTimeSlot) => {
        setIsAdding(false);
        setSelectedItem(item);
        setEditForm({
            dayOfWeek: String(item.dayOfWeek),
            startTime: item.startTime,
            endTime: item.endTime
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSave = async () => {
        if (!editForm.startTime || !editForm.endTime) {
            alert("Please fill in both start and end times");
            return;
        }

        const payload = {
            dayOfWeek: Number(editForm.dayOfWeek),
            startTime: editForm.startTime.includes(':') && editForm.startTime.split(':').length === 2 ? editForm.startTime + ':00' : editForm.startTime,
            endTime: editForm.endTime.includes(':') && editForm.endTime.split(':').length === 2 ? editForm.endTime + ':00' : editForm.endTime,
        };

        if (isAdding) {
            await createSlot(payload);
        } else if (selectedItem) {
            await updateSlot(selectedItem.slot_id, payload);
        }
        onEditOpenChange();
        fetchAll();
    };

    const renderCell = useCallback((item: ShowTimeSlot, columnKey: Key) => {
        const cellValue = item[columnKey as keyof ShowTimeSlot];
        switch (columnKey) {
            case "dayOfWeek":
                return <span className="font-bold text-zinc-700 dark:text-zinc-300">{t(`common.day_names.${item.dayOfWeek}`)}</span>;
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
                        <DropdownMenu aria-label="Slot Actions">
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
                                onPress={() => deleteSlot(item.slot_id)}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [deleteSlot, handleOpenEdit, onOpen, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Clock size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('showtimes_tab.tabs.slot')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('showtimes_tab.slot_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>

            <DataTableAdmin<ShowTimeSlot>
                columns={getColumns(t)}
                items={slots}
                isLoading={isFetching}
                searchPlaceholder={t('showtimes_tab.placeholders.select_showtime')}
                onAdd={handleOpenAdd}
                addButtonLabel={t('common.add_new')}
                totalLabel={(count) => t('showtimes_tab.total_count', { count })}
                emptyLabel={t('showtimes_tab.empty_label')}
                loadingLabel={t('showtimes_tab.loading_label')}
                defaultSort={{ column: "slot_id", direction: "descending" }}
                rowKey={(item) => `slot-${item.slot_id}-${item.startTime}`}
                searchBy={(item) => String(item.slot_id)}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "dayOfWeek",
                        name: t('showtimes_tab.slot_tab.day_of_week'),
                        options: [0,1,2,3,4,5,6].map(k => ({ name: t(`common.day_names.${k}`), uid: String(k) }))
                    }
                ]}
            />

            {/* View Details Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {t('showtimes_tab.slot_tab.title')}
                            </DrawerHeader>
                            <DrawerBody>
                                {selectedItem ? (
                                    <div className="flex flex-col gap-6 py-6">
                                        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-green-50/30 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                                            <div className="p-4 rounded-full bg-green-500/10 text-green-500">
                                                <Clock size={48} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">
                                                    {t(`common.day_names.${selectedItem.dayOfWeek}`)}
                                                </h3>
                                                <p className="text-sm text-zinc-500 font-medium mt-1">{t('showtimes_tab.slot_tab.title')}</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('showtimes_tab.slot_tab.start_time')}</span>
                                                <Badge variant="flat" color="success" className="font-bold">{selectedItem.startTime}</Badge>
                                            </div>
                                            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('showtimes_tab.slot_tab.end_time')}</span>
                                                <Badge variant="flat" color="danger" className="font-bold">{selectedItem.endTime}</Badge>
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

            {/* Edit Drawer */}
            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader>{isAdding ? t('common.add_new') : t('common.edit')} {t('showtimes_tab.slot_tab.title')}</DrawerHeader>
                            <DrawerBody>
                                <div className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label>{t('showtimes_tab.slot_tab.day_of_week')}</Label>
                                        <Select value={editForm.dayOfWeek} onValueChange={v => setEditForm(p => ({ ...p, dayOfWeek: v }))}>
                                            <SelectTrigger className="bg-sidebar"><SelectValue /></SelectTrigger>
                                            <SelectContent container={drawerContainerRef.current}>
                                                <SelectGroup>
                                                    {[0,1,2,3,4,5,6].map((k) => (
                                                        <SelectItem key={k} value={String(k)}>{t(`common.day_names.${k}`)}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>{t('showtimes_tab.slot_tab.start_time')}</Label>
                                            <Input type="time" value={editForm.startTime} onChange={e => setEditForm(p => ({ ...p, startTime: e.target.value }))} className="bg-sidebar" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>{t('showtimes_tab.slot_tab.end_time')}</Label>
                                            <Input type="time" value={editForm.endTime} onChange={e => setEditForm(p => ({ ...p, endTime: e.target.value }))} className="bg-sidebar" />
                                        </div>
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

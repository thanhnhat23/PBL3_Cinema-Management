import type { Key } from "react";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { EllipsisVertical, Eye, PenLine, Trash, Pizza, Boxes, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useSnackStore, type Snack } from "@/stores/useSnackStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";
import Image from "next/image";

const getMovieColumns = (t: any): AdminColumn[] => [
    { name: "ID", uid: "snack_id", sortable: true },
    { name: t('foods_tab.name_label'), uid: "name", sortable: true },
    { name: t('foods_tab.type_label'), uid: "type", sortable: true },
    { name: t('foods_tab.price_label'), uid: "price", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

const snackTypeColorMap: Record<string, "primary" | "success" | "warning"> = {
    food: "primary",
    drink: "success",
    combo: "warning",
};

export default function LayoutFood() {
    const { t } = useTranslation();
    const {
        snacks,
        isFetchingSnacks,
        fetchAllSnacks,
        createSnack,
        updateSnack,
        deleteSnack,
        isUpdatingSnack,
        isCreatingSnack
    } = useSnackStore();

    const getSnackTypeText = useCallback((type: number) => {
        switch (type) {
            case 0:
                return t('foods_tab.types.food');
            case 1:
                return t('foods_tab.types.drink');
            case 2:
                return t('foods_tab.types.combo');
            default:
                return t('users_tab.roles.unknown');
        }
    }, [t]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);

    const [editForm, setEditForm] = useState({
        name: "",
        type: "0",
        price: "",
        imageUrl: "",
    });

    useEffect(() => {
        fetchAllSnacks();
    }, [fetchAllSnacks]);

    const handleOpenAdd = () => {
        setIsAdding(true);
        setSelectedSnack(null);
        setEditForm({
            name: "",
            type: "0",
            price: "",
            imageUrl: "",
        });
        onEditOpen();
    };

    const handleOpenEdit = useCallback((snack: Snack) => {
        setIsAdding(false);
        setSelectedSnack(snack);
        setEditForm({
            name: snack.name ?? "",
            type: String(snack.type ?? 0),
            price: String(snack.price ?? ""),
            imageUrl: snack.imageUrl ?? "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSaveSnack = async () => {
        const payload = {
            name: editForm.name.trim(),
            type: Number(editForm.type) as Snack["type"],
            price: Number(editForm.price),
            imageUrl: editForm.imageUrl.trim() || null,
        };

        if (isAdding) {
            await createSnack(payload);
        } else if (selectedSnack) {
            await updateSnack(selectedSnack.snack_id, payload);
        }

        onEditOpenChange();
    };

    const renderCell = useCallback((snack: Snack, columnKey: Key) => {
        const cellValue = snack[columnKey as keyof Snack];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex gap-3 items-center">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <Image
                                src={snack.imageUrl || "https://placehold.co/100x100?text=Snack"}
                                alt={snack.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">{snack.name}</span>
                    </div>
                );
            case "type": {
                const typeText = getSnackTypeText(snack.type);
                const typeKey = snack.type === 0 ? 'food' : snack.type === 1 ? 'drink' : 'combo';
                return (
                    <Chip className="capitalize font-bold" color={snackTypeColorMap[typeKey]} size="sm" variant="flat">
                        {typeText}
                    </Chip>
                );
            }
            case "price":
                return <span className="font-bold text-emerald-600 dark:text-emerald-400">{Number(snack.price).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}</span>;
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
                                {t('users_tab.actions.view')}
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(snack)}
                            >
                                {t('movie_details.edit_movie')}
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                startContent={<Trash size={16} />}
                                onPress={() => deleteSnack(snack.snack_id)}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [handleOpenEdit, onOpen, deleteSnack, getSnackTypeText, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Pizza size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('foods_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('foods_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Snack>
                columns={getMovieColumns(t)}
                items={snacks}
                isLoading={isFetchingSnacks}
                searchPlaceholder={t('foods_tab.search_placeholder')}
                addButtonLabel={t('foods_tab.add_snack')}
                onAdd={handleOpenAdd}
                totalLabel={(count) => t('foods_tab.total_items', { count })}
                emptyLabel={t('foods_tab.empty_label')}
                loadingLabel={t('foods_tab.loading_label')}
                defaultSort={{ column: "name", direction: "ascending" }}
                rowKey={(item) => item.snack_id}
                searchBy={(item) => item.name}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "type",
                        name: t('foods_tab.type_label'),
                        options: [
                            { name: t('foods_tab.types.food'), uid: "0" },
                            { name: t('foods_tab.types.drink'), uid: "1" },
                            { name: t('foods_tab.types.combo'), uid: "2" },
                        ]
                    }
                ]}
            />

            {/* View Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {t('foods_tab.details_title')}
                            </DrawerHeader>

                            <DrawerBody className="p-0">
                                {selectedSnack ? (
                                    <div className="flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-950/30">
                                        <div className="relative w-full aspect-video overflow-hidden group">
                                            <Image
                                                src={selectedSnack.imageUrl || "https://placehold.co/600x400?text=Snack"}
                                                alt={selectedSnack.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                            <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                                                <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-bold w-fit">
                                                    {getSnackTypeText(selectedSnack.type)}
                                                </Badge>
                                                <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">{selectedSnack.name}</h2>
                                            </div>
                                        </div>

                                        <div className="p-8 grid grid-cols-1 gap-8">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <DollarSign size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('foods_tab.price_label')}</span>
                                                    </div>
                                                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                        {Number(selectedSnack.price).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}
                                                    </span>
                                                </div>
                                                <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Boxes size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('foods_tab.type_label')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                                                            {getSnackTypeText(selectedSnack.type)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500 font-medium italic">{t('movie_details.no_data')}</div>
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

            {/* Edit/Add Drawer */}
            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {isAdding ? t('foods_tab.add_new_snack') : t('foods_tab.edit_snack')}
                            </DrawerHeader>

                            <DrawerBody>
                                <div ref={drawerContainerRef} className="flex flex-col gap-6 py-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('foods_tab.name_label')}</Label>
                                        <Input
                                            id="name"
                                            placeholder={t('foods_tab.name_placeholder')}
                                            value={editForm.name}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                                            className="bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('foods_tab.type_label')}</Label>
                                            <Select
                                                value={editForm.type}
                                                onValueChange={(value) => setEditForm((prev) => ({ ...prev, type: value }))}
                                            >
                                                <SelectTrigger className="w-full bg-sidebar h-12 rounded-lg">
                                                    <SelectValue placeholder={t('foods_tab.type_placeholder')} />
                                                </SelectTrigger>
                                                <SelectContent container={drawerContainerRef.current}>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('foods_tab.type_label')}</SelectLabel>
                                                        <SelectItem value="0">{t('foods_tab.types.food')}</SelectItem>
                                                        <SelectItem value="1">{t('foods_tab.types.drink')}</SelectItem>
                                                        <SelectItem value="2">{t('foods_tab.types.combo')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('foods_tab.price_label')}</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                placeholder={t('foods_tab.price_placeholder')}
                                                value={editForm.price}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="imageUrl" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('foods_tab.image_label')}</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="imageUrl"
                                                placeholder={t('foods_tab.image_placeholder')}
                                                value={editForm.imageUrl}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {editForm.imageUrl && (
                                        <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                                            <Image src={editForm.imageUrl} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            </DrawerBody>

                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={handleSaveSnack}
                                    disabled={isUpdatingSnack || isCreatingSnack}
                                    className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-zinc-200 dark:shadow-none disabled:opacity-50 cursor-pointer"
                                >
                                    {isUpdatingSnack || isCreatingSnack ? t('foods_tab.processing') : isAdding ? t('foods_tab.add_snack') : t('foods_tab.save_changes')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

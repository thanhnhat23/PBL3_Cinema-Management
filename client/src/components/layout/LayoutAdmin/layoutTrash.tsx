import { useTranslation } from "react-i18next";
import { Key, useCallback, useEffect } from "react";
import {
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { EllipsisVertical, RotateCcw, Trash2 } from "lucide-react";
import { useTrashStore, type DeletedItem } from "@/stores/useTrashStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";
import { AvatarElement } from "@/components/ui/avatar";

const getTrashColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: t('common.id'), uid: "id", sortable: true },
    { name: t('common.name'), uid: "name", sortable: true },
    { name: t('common.type'), uid: "type", sortable: true },
    { name: t('common.deleted_at'), uid: "deletedAt", sortable: true },
    { name: t('common.deleted_by'), uid: "deletedBy", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

export default function LayoutTrash() {
    const { t } = useTranslation();
    const { deletedItems, isLoading, fetchDeletedItems, restoreItem, hardDeleteItem } = useTrashStore();

    useEffect(() => {
        fetchDeletedItems();
    }, [fetchDeletedItems]);

    const renderCell = useCallback((item: DeletedItem, columnKey: Key) => {
        const key = columnKey.toString();
        const cellValue = item[key as keyof DeletedItem];

        switch (key) {
            case "type":
                return (
                    <Chip size="sm" variant="flat" color="warning">
                        {item.type.toUpperCase()}
                    </Chip>
                );
            case "deletedAt":
                return <span>{new Date(item.deletedAt).toLocaleString(t('locale_code'))}</span>;
            case "deletedBy":
                return (
                    <div className="flex items-center gap-2">
                        <AvatarElement 
                            avatar={item.deletedByAvatarPath}
                            width="w-7"
                            height="h-7"
                            left="left-1/2"
                            translatex="-translate-x-1/2"
                            widthDeco="w-10"
                        />
                        <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                            {item.deletedByUserName || t('common.unknown_user')}
                        </span>
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
                                key="restore"
                                startContent={<RotateCcw size={18} />}
                                onPress={() => restoreItem(item.type, item.id)}
                            >
                                {t('common.restore')}
                            </DropdownItem>
                            <DropdownItem
                                key="hard-delete"
                                startContent={<Trash2 size={18} />}
                                className="text-danger"
                                color="danger"
                                onPress={() => {
                                    if (confirm(t('common.confirm_hard_delete'))) {
                                        hardDeleteItem(item.type, item.id);
                                    }
                                }}
                            >
                                {t('common.hard_delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [restoreItem, hardDeleteItem, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Trash2 size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('dashboard.management.trash')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('dashboard.management.trash_desc')}
                        </p>
                    </div>
                </div>
            </div>

            <DataTableAdmin<DeletedItem>
                columns={getTrashColumns(t)}
                items={deletedItems}
                isLoading={isLoading}
                searchPlaceholder={t('common.search_deleted_items')}
                totalLabel={(count) => t('common.total_deleted_count', { count })}
                emptyLabel={t('common.trash_empty')}
                loadingLabel={t('common.loading_trash')}
                rowKey={(item) => `${item.type}-${item.id}`}
                searchBy={(item) => item.name}
                renderCell={renderCell}
                defaultSort={{ column: "deletedAt", direction: "descending" }}
                filters={[
                    {
                        uid: "type",
                        name: t('common.entity_type'),
                        options: [
                            { name: t('dashboard.management.cinemas'), uid: "cinema" },
                            { name: t('location_tab.rooms'), uid: "room" },
                            { name: t('dashboard.management.showtimes'), uid: "showtime" },
                            { name: t('dashboard.management.coupons'), uid: "coupon" },
                            { name: t('dashboard.management.foods'), uid: "snack" },
                            { name: t('location_tab.locations'), uid: "location" },
                        ]
                    }
                ]}
            />
        </div>
    );
}

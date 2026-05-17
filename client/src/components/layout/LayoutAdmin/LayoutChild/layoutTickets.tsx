import type { Key } from "react";

import { useCallback, useEffect, useState } from "react";
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
    useDisclosure
} from "@heroui/react";
import { EllipsisVertical, Eye, Trash, Ticket, User, CreditCard, Calendar, MapPin } from "lucide-react";

import { useBookingStore, type Booking } from "@/stores/useBookingStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { AvatarElement } from "@/components/ui/avatar";

const getTicketColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: t('common.id'), uid: "booking_id", sortable: true },
    { name: t('tickets_tab.columns.user'), uid: "userName", sortable: true },
    { name: t('tickets_tab.columns.cinema'), uid: "cinemaName", sortable: true },
    { name: t('tickets_tab.columns.total'), uid: "totalAmount", sortable: true },
    { name: t('tickets_tab.columns.final'), uid: "finalAmount", sortable: true },
    { name: t('tickets_tab.columns.status'), uid: "status", sortable: true },
    { name: t('tickets_tab.columns.created'), uid: "createAt", sortable: true },
    { name: t('tickets_tab.columns.processed_by'), uid: "processedBy", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

const statusColorMap: Record<string, "warning" | "success" | "danger" | "default" | "secondary"> = {
    pending: "warning",
    confirmed: "success",
    cancelled: "danger",
    refunded: "secondary",
    unknown: "default",
};

export default function LayoutTickets() {
    const { t } = useTranslation();
    const { bookings, isFetchingBookings, fetchAllBookings, cancelBooking, refundBooking } = useBookingStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        fetchAllBookings();
    }, [fetchAllBookings]);

    const getStatusLabel = useCallback((status: string) => {
        const normalized = String(status ?? "").toLowerCase();
        if (normalized === "pending" || normalized === "0") return t('tickets_tab.status.pending');
        if (normalized === "confirmed" || normalized === "1") return t('tickets_tab.status.confirmed');
        if (normalized === "cancelled" || normalized === "2") return t('tickets_tab.status.cancelled');
        if (normalized === "refunded" || normalized === "3") return t('tickets_tab.status.refunded');
        return t('tickets_tab.status.unknown');
    }, [t]);

    const getStatusKey = useCallback((status: string) => {
        const normalized = String(status ?? "").toLowerCase();
        if (normalized === "pending" || normalized === "0") return "pending";
        if (normalized === "confirmed" || normalized === "1") return "confirmed";
        if (normalized === "cancelled" || normalized === "2") return "cancelled";
        if (normalized === "refunded" || normalized === "3") return "refunded";
        return "unknown";
    }, []);

    const renderCell = useCallback((booking: Booking, columnKey: Key) => {
        const cellValue = booking[columnKey as keyof Booking];

        switch (columnKey) {
            case "userName":
                return (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                            <User size={14} className="text-zinc-500" />
                        </div>
                        <span className="font-semibold">{booking.userName ?? "N/A"}</span>
                    </div>
                );
            case "cinemaName":
                return <span className="text-sm text-zinc-500 font-medium">{booking.cinemaName ?? "N/A"}</span>;
            case "totalAmount":
                return <span className="text-zinc-500 line-through text-xs">{Number(booking.totalAmount ?? 0).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}</span>;
            case "finalAmount":
                return <span className="font-bold text-emerald-600 dark:text-emerald-500">{Number(booking.finalAmount ?? 0).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}</span>;
            case "status": {
                const label = getStatusLabel(String(booking.status));
                const key = getStatusKey(String(booking.status));
                return (
                    <Chip className="capitalize font-bold" color={statusColorMap[key] ?? "default"} size="sm" variant="flat">
                        {label}
                    </Chip>
                );
            }
            case "createAt":
                return <span className="text-xs font-medium text-zinc-400">{new Date(String(booking.createAt)).toLocaleDateString(t('locale_code'))}</span>;
            case "processedBy":
                return (
                    <div className="flex items-center gap-2">
                        {booking.processedByUserName ? (
                            <>
                                <AvatarElement 
                                    avatar={booking.processedByAvatarPath}
                                    width="w-7"
                                    height="h-7"
                                    left="left-1/2"
                                    translatex="-translate-x-1/2"
                                    widthDeco="w-10"
                                />
                                <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                                    {booking.processedByUserName}
                                </span>
                            </>
                        ) : (
                            <span className="text-[10px] font-bold uppercase text-zinc-400">
                                —
                            </span>
                        )}
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
                                startContent={<Eye size={18} />}
                                onPress={() => {
                                    setSelectedBooking(booking);
                                    onOpen();
                                }}
                            >
                                {t('common.view')}
                            </DropdownItem>
                            <DropdownItem 
                                key="cancel" 
                                startContent={<Trash size={18} />} 
                                className="text-danger" 
                                color="danger"
                                onPress={() => cancelBooking(booking.booking_id)}
                            >
                                {t('tickets_tab.cancel_ticket')}
                            </DropdownItem>
                            <DropdownItem 
                                key="refund" 
                                startContent={<CreditCard size={18} />} 
                                className="text-warning" 
                                color="warning"
                                onPress={() => refundBooking(booking.booking_id)}
                            >
                                {t('tickets_tab.refund_ticket')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [onOpen, t, getStatusLabel, getStatusKey]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <CreditCard size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('tickets_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('tickets_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Booking>
                columns={getTicketColumns(t)}
                items={bookings}
                isLoading={isFetchingBookings}
                searchPlaceholder={t('tickets_tab.search_placeholder')}
                totalLabel={(count) => t('tickets_tab.total_count', { count })}
                emptyLabel={t('tickets_tab.empty_label')}
                loadingLabel={t('tickets_tab.loading_label')}
                defaultSort={{ column: "createAt", direction: "descending" }}
                rowKey={(item) => item.booking_id}
                searchBy={(item) => String(item.userName ?? "")}
                renderCell={renderCell}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {t('tickets_tab.details_title')}
                            </DrawerHeader>

                            <DrawerBody className="p-0">
                                {selectedBooking ? (
                                    <div className="flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-950/30">
                                        <div className="p-8 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                                <Ticket size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h2 className="text-2xl font-bold tracking-tight">{selectedBooking.userName || t('tickets_tab.customer')}</h2>
                                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">{t('tickets_tab.booking_id')}: #{selectedBooking.booking_id}</p>
                                            </div>
                                            <div className="mt-2">
                                                <Chip className="font-bold px-3 py-1" color={statusColorMap[getStatusKey(String(selectedBooking.status))] || "default"} variant="flat">
                                                    {getStatusLabel(String(selectedBooking.status))}
                                                </Chip>
                                            </div>
                                        </div>

                                        <div className="p-6 grid grid-cols-1 gap-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <MapPin size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('tickets_tab.columns.cinema')}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{selectedBooking.cinemaName || "N/A"}</span>
                                                </div>
                                                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Calendar size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('tickets_tab.booking_date')}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                                                        {new Date(String(selectedBooking.createAt)).toLocaleDateString(t('locale_code'), { dateStyle: 'full' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 flex flex-col gap-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                                    <CreditCard size={16} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('tickets_tab.payment_info')}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-zinc-500">{t('tickets_tab.original_price')}</span>
                                                        <span className="text-zinc-400 line-through">{Number(selectedBooking.totalAmount ?? 0).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}</span>
                                                    </div>
                                                    <div className="h-px bg-emerald-100 dark:bg-emerald-900/30" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{t('tickets_tab.total_label')}</span>
                                                        <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                                                            {Number(selectedBooking.finalAmount ?? 0).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('movie_details.metadata')}</span>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-[10px] border-zinc-200 dark:border-zinc-800">{t('tickets_tab.user_id')}: {selectedBooking.user_id}</Badge>
                                                    <Badge variant="outline" className="text-[10px] border-zinc-200 dark:border-zinc-800">{t('tickets_tab.booking_id')}: {selectedBooking.booking_id}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500 font-medium">{t('tickets_tab.empty_label')}</div>
                                )}
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

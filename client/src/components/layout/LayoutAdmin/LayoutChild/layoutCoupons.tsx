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
    DrawerFooter,
    useDisclosure
} from "@heroui/react";
import { EllipsisVertical, Eye, PenLine, Trash, Ticket, Calendar, Percent, Banknote, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCouponStore, type Coupon } from "@/stores/useCouponStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
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
import { format } from "date-fns";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const getCouponColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: "ID", uid: "coupon_id", sortable: true },
    { name: t('coupons_tab.columns.code'), uid: "code", sortable: true },
    { name: t('coupons_tab.columns.type'), uid: "coupon_type", sortable: true },
    { name: t('coupons_tab.columns.discount_type'), uid: "type", sortable: true },
    { name: t('coupons_tab.columns.value'), uid: "discountValue", sortable: true },
    { name: t('coupons_tab.columns.usage'), uid: "current_usage", sortable: true },
    { name: t('coupons_tab.columns.status'), uid: "status", sortable: true },
    { name: t('coupons_tab.columns.expiry'), uid: "endDate", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

const discountTypeColorMap: Record<string, "primary" | "success" | "default"> = {
    percentage: "primary",
    fixedamount: "success",
    unknown: "default",
};

export default function LayoutCoupons() {
    const { t } = useTranslation();
    const { 
        coupons, 
        isFetchingCoupons, 
        fetchAllCoupons, 
        createCoupon, 
        updateCoupon, 
        deleteCoupon,
        isCreatingCoupon,
        isUpdatingCoupon
    } = useCouponStore();
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const drawerContainerRef = useRef<HTMLDivElement | null>(null);

    const [editForm, setEditForm] = useState({
        code: "",
        description: "",
        type: "0", // DiscountType: 0=Percentage, 1=FixedAmount
        coupon_type: "0", // CouponType: 0=Limited, 1=Holiday, 2=Never
        status: "0", // CouponStatus: 0=Active, 1=Expired, 2=Disabled
        discountValue: "",
        maxDiscountAmount: "",
        minOrderValue: "",
        max_usage: "",
        startDate: "",
        endDate: "",
        isHoliday: "false",
        applies_to: "Both",
    });

    useEffect(() => {
        fetchAllCoupons();
    }, [fetchAllCoupons]);

    const getDiscountTypeText = useCallback((type: number) => {
        if (type === 0) return t('coupons_tab.types.percentage');
        if (type === 1) return t('coupons_tab.types.fixed');
        return "Unknown";
    }, [t]);

    const getDiscountTypeKey = useCallback((type: number) => {
        if (type === 0) return "percentage";
        if (type === 1) return "fixedamount";
        return "unknown";
    }, []);

    const handleOpenAdd = () => {
        setIsAdding(true);
        setSelectedCoupon(null);
        setEditForm({
            code: "",
            description: "",
            type: "0",
            coupon_type: "0",
            status: "0",
            discountValue: "",
            maxDiscountAmount: "",
            minOrderValue: "",
            max_usage: "",
            startDate: format(new Date(), "yyyy-MM-dd"),
            endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
            isHoliday: "false",
            applies_to: "Both",
        });
        onEditOpen();
    };

    const handleOpenEdit = useCallback((coupon: Coupon) => {
        setIsAdding(false);
        setSelectedCoupon(coupon);
        setEditForm({
            code: coupon.code,
            description: coupon.description ?? "",
            type: String(coupon.type),
            coupon_type: String(coupon.coupon_type),
            status: String(coupon.status),
            discountValue: String(coupon.discountValue),
            maxDiscountAmount: String(coupon.maxDiscountAmount),
            minOrderValue: String(coupon.minOrderValue),
            max_usage: coupon.max_usage ? String(coupon.max_usage) : "",
            startDate: coupon.startDate ? format(new Date(coupon.startDate), "yyyy-MM-dd") : "",
            endDate: coupon.endDate ? format(new Date(coupon.endDate), "yyyy-MM-dd") : "",
            isHoliday: String(coupon.isHoliday),
            applies_to: coupon.applies_to || "Both",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSaveCoupon = async () => {
        const payload: Partial<Coupon> = {
            description: editForm.description.trim(),
            type: Number(editForm.type) as 0 | 1,
            coupon_type: Number(editForm.coupon_type) as 0 | 1 | 2,
            status: Number(editForm.status) as 0 | 1 | 2,
            discountValue: Number(editForm.discountValue),
            maxDiscountAmount: Number(editForm.maxDiscountAmount),
            minOrderValue: Number(editForm.minOrderValue),
            max_usage: editForm.max_usage ? Number(editForm.max_usage) : null,
            startDate: editForm.startDate ? format(new Date(editForm.startDate), "yyyy-MM-dd'T'HH:mm:ss'Z'") : undefined,
            endDate: editForm.endDate ? format(new Date(editForm.endDate), "yyyy-MM-dd'T'HH:mm:ss'Z'") : undefined,
            isHoliday: editForm.isHoliday === "true",
            applies_to: editForm.applies_to,
        };

        if (!isAdding && selectedCoupon) {
            payload.code = editForm.code.trim();
        }

        if (isAdding) {
            await createCoupon(payload);
        } else if (selectedCoupon) {
            await updateCoupon(selectedCoupon.coupon_id, payload);
        }

        onEditOpenChange();
    };

    const renderCell = useCallback((coupon: Coupon, columnKey: Key) => {
        const cellValue = coupon[columnKey as keyof Coupon];

        switch (columnKey) {
            case "code":
                return (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500">
                            <Ticket size={14} />
                        </div>
                        <span className="font-bold tracking-tight text-blue-600 dark:text-blue-400">{coupon.code}</span>
                    </div>
                );
            case "coupon_type": {
                const types = [t('coupons_tab.cats.limited'), t('coupons_tab.cats.holiday'), t('coupons_tab.cats.never')];
                const colors: ("default" | "warning" | "secondary")[] = ["default", "warning", "secondary"];
                return (
                    <Chip className="capitalize font-bold" color={colors[coupon.coupon_type]} size="sm" variant="flat">
                        {types[coupon.coupon_type]}
                    </Chip>
                );
            }
            case "type": {
                const typeText = getDiscountTypeText(coupon.type);
                const typeKey = getDiscountTypeKey(coupon.type);
                return (
                    <Chip className="capitalize font-bold" color={discountTypeColorMap[typeKey]} size="sm" variant="flat">
                        {typeText}
                    </Chip>
                );
            }
            case "discountValue":
                return (
                    <div className="flex items-center gap-1 font-bold">
                        {/* {coupon.type === 0 ? <Percent size={14} className="text-zinc-400" /> : <Banknote size={14} className="text-zinc-400" />} */}
                        <span>{coupon.type === 0 ? `${coupon.discountValue}%` : `${Number(coupon.discountValue).toLocaleString(t('locale_code'))} ${t('common.currency_vnd')}`}</span>
                    </div>
                );
            case "current_usage":
                return (
                    <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-xs">{coupon.current_usage} / {coupon.max_usage ?? "∞"}</span>
                        <div className="w-20 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-amber-500 transition-all duration-500" 
                                style={{ width: `${coupon.max_usage ? Math.min(100, (coupon.current_usage / coupon.max_usage) * 100) : 0}%` }} 
                            />
                        </div>
                    </div>
                );
            case "endDate":
                return (
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800",
                        coupon.coupon_type === 2 ? "text-purple-500 bg-purple-500/10" : "text-zinc-500"
                    )}>
                        {coupon.coupon_type === 2 ? t('profile.no_expiration') : new Date(String(coupon.endDate)).toLocaleDateString(t('locale_code'))}
                    </span>
                );
            case "status": {
                const statuses = ["Active", "Expired", "Disabled"];
                const colors: ("success" | "danger" | "default")[] = ["success", "danger", "default"];
                return (
                    <Chip className="capitalize font-bold" color={colors[coupon.status]} size="sm" variant="flat">
                        {statuses[coupon.status]}
                    </Chip>
                );
            }
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
                                    setSelectedCoupon(coupon);
                                    onOpen();
                                }}
                            >
                                {t('common.view')}
                            </DropdownItem>
                            <DropdownItem 
                                key="edit" 
                                startContent={<PenLine size={16} />}
                                onPress={() => handleOpenEdit(coupon)}
                            >
                                {t('common.edit')}
                            </DropdownItem>
                            <DropdownItem 
                                key="delete" 
                                className="text-danger" 
                                color="danger" 
                                startContent={<Trash size={16} />}
                                onPress={() => deleteCoupon(coupon.coupon_id)}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [onOpen, deleteCoupon, handleOpenEdit, t, getDiscountTypeText, getDiscountTypeKey]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Ticket size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('coupons_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('coupons_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>
            <DataTableAdmin<Coupon>
                columns={getCouponColumns(t)}
                items={coupons}
                isLoading={isFetchingCoupons}
                searchPlaceholder={t('coupons_tab.search_placeholder')}
                addButtonLabel={t('coupons_tab.add_coupon')}
                onAdd={handleOpenAdd}
                totalLabel={(count) => t('coupons_tab.total_count', { count })}
                emptyLabel={t('coupons_tab.empty_label')}
                loadingLabel={t('coupons_tab.loading_label')}
                defaultSort={{ column: "code", direction: "ascending" }}
                rowKey={(item) => item.coupon_id}
                searchBy={(item) => item.code}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "coupon_type",
                        name: t('coupons_tab.type_label'),
                        options: [
                            { name: t('coupons_tab.cats.limited'), uid: "0" },
                            { name: t('coupons_tab.cats.holiday'), uid: "1" },
                            { name: t('coupons_tab.cats.never'), uid: "2" },
                        ]
                    }
                ]}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {t('coupons_tab.details_title')}
                            </DrawerHeader>

                            <DrawerBody className="p-0">
                                {selectedCoupon ? (
                                    <div className="flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-950/30">
                                        <div className="p-10 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-6">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-colors" />
                                                <div className="relative w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 border-2 border-blue-100 dark:border-blue-800 shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                                    <Ticket size={40} />
                                                </div>
                                            </div>
                                            <div className="text-center flex flex-col gap-2">
                                                <h2 className="text-3xl font-black tracking-tighter text-blue-600 dark:text-blue-400 uppercase">{selectedCoupon.code}</h2>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Chip color={selectedCoupon.coupon_type === 1 ? "warning" : selectedCoupon.coupon_type === 2 ? "secondary" : "success"} variant="flat" size="sm" className="font-bold">
                                                        {selectedCoupon.coupon_type === 1 ? t('coupons_tab.cats.holiday') : selectedCoupon.coupon_type === 2 ? t('coupons_tab.cats.never') : t('coupons_tab.cats.limited')}
                                                    </Chip>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 grid grid-cols-1 gap-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Percent size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('coupons_tab.value_label')}</span>
                                                    </div>
                                                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                        {selectedCoupon.type === 0 ? `${selectedCoupon.discountValue}%` : `${Number(selectedCoupon.discountValue).toLocaleString(t('locale_code'))} ${t('common.currency_vnd')}`}
                                                    </span>
                                                </div>
                                                <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Banknote size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('coupons_tab.min_order_label')}</span>
                                                    </div>
                                                    <span className="text-lg font-bold text-zinc-700 dark:text-zinc-200">
                                                        {Number(selectedCoupon.minOrderValue).toLocaleString(t('locale_code'))} {t('common.currency_vnd')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-6 shadow-sm">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Calendar size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('coupons_tab.applied_all')}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('coupons_tab.start_date')}</span>
                                                        <span className="text-sm font-bold">{new Date(String(selectedCoupon.startDate)).toLocaleDateString(t('locale_code'), { dateStyle: 'long' })}</span>
                                                    </div>
                                                    <div className="w-10 h-px bg-zinc-100 dark:bg-zinc-800" />
                                                    <div className="flex flex-col gap-1 text-right">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('coupons_tab.end_date')}</span>
                                                        <span className="text-sm font-bold text-rose-500">
                                                            {selectedCoupon.coupon_type === 2 ? t('profile.no_expiration') : new Date(String(selectedCoupon.endDate)).toLocaleDateString(t('locale_code'), { dateStyle: 'long' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Clock size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('coupons_tab.usage_label')}</span>
                                                    </div>
                                                    <span className="text-xl font-bold">
                                                        {selectedCoupon.current_usage} / {selectedCoupon.max_usage ?? "∞"}
                                                    </span>
                                                </div>
                                                <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3 shadow-sm">
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Info size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('coupons_tab.status_label')}</span>
                                                    </div>
                                                    <Chip color={selectedCoupon.status === 0 ? "success" : "danger"} variant="flat" size="sm" className="font-bold">
                                                        {selectedCoupon.status === 0 ? "Active" : selectedCoupon.status === 1 ? "Expired" : "Disabled"}
                                                    </Chip>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 p-4 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Clock size={12} />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">System Record</span>
                                                </div>
                                                <p className="text-[11px] text-zinc-500 font-medium">{t('coupons_tab.applied_all')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500 font-medium italic">{t('coupons_tab.no_data')}</div>
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

            {/* Add/Edit Drawer */}
            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="sm" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="border-b border-zinc-100 dark:border-zinc-800">
                                {isAdding ? t('coupons_tab.add_new_coupon') : t('coupons_tab.edit_coupon')}
                            </DrawerHeader>

                            <DrawerBody>
                                <div ref={drawerContainerRef} className="flex flex-col gap-6 py-6">
                                    {!isAdding && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="code" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.code_label')}</Label>
                                            <Input
                                                id="code"
                                                value={editForm.code}
                                                readOnly
                                                className="bg-zinc-50 dark:bg-zinc-900 h-12 rounded-lg font-mono font-bold text-blue-600 opacity-70"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.desc_label')}</Label>
                                        <Input
                                            id="description"
                                            placeholder={t('coupons_tab.desc_placeholder')}
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                                            className="bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.type_label')}</Label>
                                            <Select
                                                value={editForm.coupon_type}
                                                onValueChange={(v) => {
                                                    setEditForm(p => ({ ...p, coupon_type: v }));
                                                    if (v === "2") { // Never
                                                        setEditForm(p => ({ ...p, startDate: "", endDate: "", max_usage: "" }));
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg overflow-hidden">
                                                    <SelectValue placeholder={t('coupons_tab.type_label')} className="truncate" />
                                                </SelectTrigger>
                                                <SelectContent container={drawerContainerRef.current}>
                                                    <SelectGroup>
                                                        <SelectItem value="0">{t('coupons_tab.cats.limited')}</SelectItem>
                                                        <SelectItem value="1">{t('coupons_tab.cats.holiday')}</SelectItem>
                                                        <SelectItem value="2">{t('coupons_tab.cats.never')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.status_label')}</Label>
                                            <Select
                                                value={editForm.status}
                                                onValueChange={(v) => setEditForm(p => ({ ...p, status: v }))}
                                            >
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent container={drawerContainerRef.current}>
                                                    <SelectGroup>
                                                        <SelectItem value="0">Active</SelectItem>
                                                        <SelectItem value="1">Expired</SelectItem>
                                                        <SelectItem value="2">Disabled</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.discount_type_label')}</Label>
                                            <Select
                                                value={editForm.type}
                                                onValueChange={(v) => setEditForm(p => ({ ...p, type: v }))}
                                            >
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg overflow-hidden">
                                                    <SelectValue placeholder={t('coupons_tab.discount_type_label')} className="truncate" />
                                                </SelectTrigger>
                                                <SelectContent container={drawerContainerRef.current}>
                                                    <SelectGroup>
                                                        <SelectItem value="0">{t('coupons_tab.types.percentage')}</SelectItem>
                                                        <SelectItem value="1">{t('coupons_tab.types.fixed')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="discountValue" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.value_label')}</Label>
                                            <Input
                                                id="discountValue"
                                                type="number"
                                                value={editForm.discountValue}
                                                onChange={(e) => setEditForm(p => ({ ...p, discountValue: e.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="maxDiscountAmount" className={cn("text-xs font-bold uppercase tracking-wider text-zinc-500", editForm.type === "1" && "opacity-30")}>{t('coupons_tab.max_discount_label')}</Label>
                                            <Input
                                                id="maxDiscountAmount"
                                                type="number"
                                                disabled={editForm.type === "1"}
                                                value={editForm.maxDiscountAmount}
                                                onChange={(e) => setEditForm(p => ({ ...p, maxDiscountAmount: e.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg disabled:opacity-30"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="minOrderValue" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.min_order_label')}</Label>
                                            <Input
                                                id="minOrderValue"
                                                type="number"
                                                value={editForm.minOrderValue}
                                                onChange={(e) => setEditForm(p => ({ ...p, minOrderValue: e.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="max_usage" className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.max_usage_label')}</Label>
                                            <Input
                                                id="max_usage"
                                                type="number"
                                                placeholder="Unlimited"
                                                value={editForm.max_usage}
                                                onChange={(e) => setEditForm(p => ({ ...p, max_usage: e.target.value }))}
                                                className="bg-sidebar h-12 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Applies To</Label>
                                            <Select
                                                value={editForm.applies_to}
                                                onValueChange={(v) => setEditForm(p => ({ ...p, applies_to: v }))}
                                            >
                                                <SelectTrigger className="bg-sidebar h-12 rounded-lg">
                                                    <SelectValue placeholder="Applies To" />
                                                </SelectTrigger>
                                                <SelectContent container={drawerContainerRef.current}>
                                                    <SelectGroup>
                                                        <SelectItem value="Ticket">Ticket</SelectItem>
                                                        <SelectItem value="Snack">Snack</SelectItem>
                                                        <SelectItem value="Both">Both</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {editForm.coupon_type !== "2" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.start_date')}</Label>
                                                <Input
                                                    type="date"
                                                    value={editForm.startDate}
                                                    onChange={(e) => setEditForm(p => ({ ...p, startDate: e.target.value }))}
                                                    className="bg-sidebar h-12 rounded-lg"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('coupons_tab.end_date')}</Label>
                                                <Input
                                                    type="date"
                                                    value={editForm.endDate}
                                                    onChange={(e) => setEditForm(p => ({ ...p, endDate: e.target.value }))}
                                                    className="bg-sidebar h-12 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DrawerBody>

                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    onClick={handleSaveCoupon}
                                    disabled={isCreatingCoupon || isUpdatingCoupon}
                                    className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-zinc-200 dark:shadow-none disabled:opacity-50 cursor-pointer"
                                >
                                    {isCreatingCoupon || isUpdatingCoupon ? t('coupons_tab.processing') : isAdding ? t('coupons_tab.create_btn') : t('coupons_tab.save_changes')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

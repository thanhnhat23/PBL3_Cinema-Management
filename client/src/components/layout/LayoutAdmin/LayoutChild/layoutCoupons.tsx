import type { Key } from "react";

import { useCallback, useEffect } from "react";
import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { EllipsisVertical, Eye, PenLine, Trash } from "lucide-react";

import { useCouponStore, type Coupon } from "@/stores/useCouponStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";

const columns: AdminColumn[] = [
    { name: "ID", uid: "coupon_id", sortable: true },
    { name: "MÃ GIẢM GIÁ", uid: "code", sortable: true },
    { name: "LOẠI", uid: "type", sortable: true },
    { name: "GIÁ TRỊ GIẢM", uid: "discountValue", sortable: true },
    { name: "GIÁ TRỊ ĐƠN HÀNG TỐI THIỂU", uid: "minOrderValue", sortable: true },
    { name: "NGÀY BẮT ĐẦU", uid: "startDate", sortable: true },
    { name: "NGÀY KẾT THÚC", uid: "endDate", sortable: true },
    { name: "TRẠNG THÁI", uid: "isHoliday", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const discountTypeColorMap: Record<string, "primary" | "success" | "default"> = {
    percentage: "primary",
    fixedamount: "success",
    unknown: "default",
};

const getDiscountTypeText = (type: number) => {
    if (type === 0) return "Percentage";
    if (type === 1) return "Fixed Amount";
    return "Unknown";
};

const getDiscountTypeKey = (typeText: string) => typeText.toLowerCase().replace(/\s+/g, "");

export default function LayoutCoupons() {
    const { coupons, isFetchingCoupons, fetchAllCoupons } = useCouponStore();

    useEffect(() => {
        fetchAllCoupons();
    }, [fetchAllCoupons]);

    const renderCell = useCallback((coupon: Coupon, columnKey: Key) => {
        const cellValue = coupon[columnKey as keyof Coupon];

        switch (columnKey) {
            case "code":
                return <span className="font-semibold">{coupon.code}</span>;
            case "type": {
                const typeText = getDiscountTypeText(coupon.type);
                return (
                    <Chip className="capitalize" color={discountTypeColorMap[getDiscountTypeKey(typeText)]} size="sm" variant="flat">
                        {typeText}
                    </Chip>
                );
            }
            case "discountValue":
                return <span>{coupon.type === 0 ? `${coupon.discountValue}%` : `$${coupon.discountValue.toFixed(2)}`}</span>;
            case "minOrderValue":
                return <span>{coupon.minOrderValue.toFixed(0)}vnđ</span>;
            case "startDate":
                return <span>{new Date(String(coupon.startDate)).toLocaleDateString("vi-VN")}</span>;
            case "endDate":
                return <span>{new Date(String(coupon.endDate)).toLocaleDateString("vi-VN")}</span>;
            case "isHoliday":
                return (
                    <Chip className="capitalize" color={coupon.isHoliday ? "warning" : "success"} size="sm" variant="flat">
                        {coupon.isHoliday ? "Holiday" : "Normal"}
                    </Chip>
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
                            <DropdownItem key="view" startContent={<Eye size={16} />}>Xem</DropdownItem>
                            <DropdownItem key="edit" startContent={<PenLine size={16} />}>Sửa</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={16} />}>
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, []);

    return (
        <>
            <DataTableAdmin<Coupon>
                columns={columns}
                items={coupons}
                isLoading={isFetchingCoupons}
                searchPlaceholder="Tìm theo mã giảm giá..."
                addButtonLabel="Thêm mã"
                totalLabel={(count) => `Tổng cộng ${count} mã giảm giá`}
                emptyLabel="Không có mã giảm giá"
                loadingLabel="Đang tải dữ liệu mã giảm giá..."
                defaultSort={{ column: "code", direction: "ascending" }}
                rowKey={(item) => item.coupon_id}
                searchBy={(item) => item.code}
                renderCell={renderCell}
            />
        </>
    )
}

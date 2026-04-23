import type { Key } from "react";

import { useCallback, useEffect } from "react";
import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { EllipsisVertical, Eye, Ban, User } from "lucide-react";

import { AvatarElement } from "@/components/ui/avatar";
import { useUserStore, type User as AppUser } from "@/stores/useUserStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";

const columns: AdminColumn[] = [
    { name: "ID", uid: "user_id", sortable: true },
    { name: "NGƯỜI DÙNG", uid: "username", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "TUỔI", uid: "age", sortable: true },
    { name: "XÁC MINH", uid: "isVerified", sortable: true },
    { name: "TRẠNG THÁI", uid: "isBanned", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

const verifyColorMap: Record<string, "success" | "warning"> = {
    true: "success",
    false: "warning",
};

const bannedColorMap: Record<string, "danger" | "success"> = {
    true: "danger",
    false: "success",
};

const roleColorMap: Record<string, "danger" | "warning" | "primary" | "default"> = {
    admin: "danger",
    staff: "warning",
    user: "primary",
    unknown: "default",
};

const getRoleLabel = (role: string) => {
    const normalized = String(role ?? "").trim().toLowerCase();

    if (normalized === "0" || normalized === "admin") return "Admin";
    if (normalized === "1" || normalized === "staff") return "Staff";
    if (normalized === "2" || normalized === "user") return "User";
    return "Unknown";
};

const getRoleNumber = (role: string) => {
    const normalized = String(role ?? "").trim().toLowerCase();

    if (normalized === "0" || normalized === "admin") return 0;
    if (normalized === "1" || normalized === "staff") return 1;
    return 2;
};

export default function LayoutUsers() {
    const { users, isFetchingAllUsers, fetchAllUsers } = useUserStore();

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const renderCell = useCallback((user: AppUser, columnKey: Key) => {
        const cellValue = user[columnKey as keyof AppUser];

        switch (columnKey) {
            case "user_id":
                return <span className="font-mono text-xs">{user.user_id || user.profile_slug || "N/A"}</span>;
            case "username":
                return (
                    <div className="flex items-center gap-3">
                        <AvatarElement
                            previewSrc={user.avatar_path ? user.avatar_path : undefined}
                            role={getRoleNumber(user.role)}
                            width="w-8"
                            height="h-8"
                            widthDeco="w-11"
                            left="left-1/2"
                            translatex="-translate-x-1/2"
                        />

                        <div className="flex flex-col">
                            <p className="text-bold text-small">{user.username}</p>
                            <p className="text-bold text-tiny text-default-400">{user.email}</p>
                        </div>
                    </div>
                );
            case "role": {
                const roleLabel = getRoleLabel(user.role);
                return (
                    <Chip className="capitalize" color={roleColorMap[roleLabel.toLowerCase()] ?? "default"} size="sm" variant="flat">
                        {roleLabel}
                    </Chip>
                );
            }
            case "isVerified":
                return (
                    <Chip className="capitalize" color={verifyColorMap[String(user.isVerified)]} size="sm" variant="flat">
                        {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </Chip>
                );
            case "isBanned":
                return (
                    <Chip className="capitalize" color={bannedColorMap[String(user.isBanned)]} size="sm" variant="flat">
                        {user.isBanned ? "Bị khóa" : "Hoạt động"}
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
                            <DropdownItem key="view" startContent={<Eye size={18} />} showDivider>
                                Xem
                            </DropdownItem>

                            <DropdownItem key="delete" startContent={<Ban size={18} />} className="text-danger" color="danger">
                                Cấm
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <User />
                Dashboard: Quản lí người dùng
            </h1>

            <DataTableAdmin<AppUser>
                columns={columns}
                items={users}
                isLoading={isFetchingAllUsers}
                searchPlaceholder="Tìm theo tên người dùng..."
                addButtonLabel="Thêm user"
                totalLabel={(count) => `Tổng cộng ${count} người dùng`}
                emptyLabel="Không có người dùng"
                loadingLabel="Đang tải dữ liệu người dùng..."
                defaultSort={{ column: "username", direction: "ascending" }}
                rowKey={(item) => `${item.user_id || "user"}-${item.profile_slug}-${item.email}-${item.createdAt}`}
                searchBy={(item) => item.username}
                renderCell={renderCell}
            />
        </div>
    )
}

import type { Key } from "react";

import { useCallback, useEffect, useMemo } from "react";
import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { EllipsisVertical, Eye, Ban, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AvatarElement } from "@/components/ui/avatar";
import { useUserStore, type User as AppUser } from "@/stores/useUserStore";
import DataTableAdmin, { type AdminColumn } from "../dataTable";

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

const getRoleNumber = (role: string) => {
    const normalized = String(role ?? "").trim().toLowerCase();

    if (normalized === "0" || normalized === "admin") return 0;
    if (normalized === "1" || normalized === "staff") return 1;
    return 2;
};

export default function LayoutUsers() {
    const { t } = useTranslation();
    const { users, isFetchingAllUsers, fetchAllUsers } = useUserStore();

    const columns: AdminColumn[] = useMemo(() => [
        { name: t('common.id'), uid: "user_id", sortable: true },
        { name: t('users_tab.columns.user'), uid: "username", sortable: true },
        { name: t('common.email'), uid: "email", sortable: true },
        { name: t('users_tab.columns.role'), uid: "role", sortable: true },
        { name: t('users_tab.columns.age'), uid: "age", sortable: true },
        { name: t('users_tab.columns.verify'), uid: "isVerified", sortable: true },
        { name: t('users_tab.columns.status'), uid: "isBanned", sortable: true },
        { name: t('common.actions'), uid: "actions" },
    ], [t]);

    const getRoleLabel = useCallback((role: string) => {
        const normalized = String(role ?? "").trim().toLowerCase();

        if (normalized === "0" || normalized === "admin") return t('users_tab.roles.admin');
        if (normalized === "1" || normalized === "staff") return t('users_tab.roles.staff');
        if (normalized === "2" || normalized === "user") return t('users_tab.roles.user');
        return t('users_tab.roles.unknown');
    }, [t]);

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
                const roleKey = String(user.role).toLowerCase() === "0" || String(user.role).toLowerCase() === "admin" ? "admin" :
                    String(user.role).toLowerCase() === "1" || String(user.role).toLowerCase() === "staff" ? "staff" :
                        String(user.role).toLowerCase() === "2" || String(user.role).toLowerCase() === "user" ? "user" : "unknown";
                return (
                    <Chip className="capitalize" color={roleColorMap[roleKey] ?? "default"} size="sm" variant="flat">
                        {roleLabel}
                    </Chip>
                );
            }
            case "isVerified":
                return (
                    <Chip className="capitalize" color={verifyColorMap[String(user.isVerified)]} size="sm" variant="flat">
                        {user.isVerified ? t('users_tab.verify_status.verified') : t('users_tab.verify_status.unverified')}
                    </Chip>
                );
            case "isBanned":
                return (
                    <Chip className="capitalize" color={bannedColorMap[String(user.isBanned)]} size="sm" variant="flat">
                        {user.isBanned ? t('users_tab.banned_status.banned') : t('users_tab.banned_status.active')}
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
                                {t('common.view')}
                            </DropdownItem>

                            <DropdownItem key="delete" startContent={<Ban size={18} />} className="text-danger" color="danger">
                                {t('users_tab.actions.ban')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [getRoleLabel, t]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <User size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('users_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('users_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>

            <DataTableAdmin<AppUser>
                columns={columns}
                items={users}
                isLoading={isFetchingAllUsers}
                searchPlaceholder={t('users_tab.search_placeholder')}
                addButtonLabel={t('users_tab.add_user')}
                totalLabel={(count) => t('users_tab.total_count', { count })}
                emptyLabel={t('users_tab.empty_label')}
                loadingLabel={t('users_tab.loading_label')}
                defaultSort={{ column: "username", direction: "ascending" }}
                rowKey={(item) => `${item.user_id || "user"}-${item.profile_slug}-${item.email}-${item.createdAt}`}
                searchBy={(item) => item.username}
                renderCell={renderCell}
                hideDeleteSelected={true}
                filters={[
                    {
                        uid: "role",
                        name: t('users_tab.columns.role'),
                        options: [
                            { name: t('users_tab.roles.admin'), uid: "0" },
                            { name: t('users_tab.roles.staff'), uid: "1" },
                            { name: t('users_tab.roles.user'), uid: "2" },
                        ]
                    },
                    {
                        uid: "isVerified",
                        name: t('users_tab.columns.verify'),
                        options: [
                            { name: t('users_tab.verify_status.verified'), uid: "true" },
                            { name: t('users_tab.verify_status.unverified'), uid: "false" },
                        ]
                    },
                    {
                        uid: "isBanned",
                        name: t('users_tab.columns.status'),
                        options: [
                            { name: t('users_tab.banned_status.banned'), uid: "true" },
                            { name: t('users_tab.banned_status.active'), uid: "false" },
                        ]
                    }
                ]}
            />
        </div>
    )
}

'use client';

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from '@/components/layout/sidebar';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import {
    Clapperboard,
    House,
    Ticket,
    Drama,
    MapPinHouse,
    User,
    ChartColumnDecreasing,
    Database,
    LogOut,
    Sun,
    Moon,
    ChevronDown,
    Utensils
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { AvatarElement } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/useAuthStore';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Breadcrumbs, BreadcrumbItem, Selection } from '@heroui/react';
import { ThemeToggler } from '@/components/ui/effects/themeToggler';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { LayoutAdmin } from '@/components/layout/layoutAdmin';
import Link from 'next/link';

const Management = ["Phim", "Vé", "Suất chiếu", "Rạp chiếu", "Thức ăn"] as const;

type LayoutKey =
    | 'Thống kê'
    | 'Phim'
    | 'Vé'
    | 'Suất chiếu'
    | 'Rạp chiếu'
    | 'Người dùng'
    | 'Đồng bộ dữ liệu'
    | 'Thống kê doanh thu'
    | 'Thức ăn';

const ManagementLayoutMap: Record<(typeof Management)[number], LayoutKey> = {
    "Phim": 'Phim',
    "Vé": 'Vé',
    "Suất chiếu": 'Suất chiếu',
    "Rạp chiếu": 'Rạp chiếu',
    "Thức ăn": "Thức ăn"
};

const Icon: Record<(typeof Management)[number], ReactNode> = {
    "Phim": <Clapperboard size={18} />,
    "Vé": <Ticket size={18} />,
    "Suất chiếu": <Drama size={18} />,
    "Rạp chiếu": <MapPinHouse size={18} />,
    "Thức ăn": <Utensils size={18} />
};

const THEME_CONFIG = [
    { label: "Xanh dương", color: "bg-blue-500" },
    { label: "Xanh lá", color: "bg-green-500" },
    { label: "Vàng", color: "bg-yellow-500" },
    { label: "Đỏ", color: "bg-red-500" },
    { label: "Hồng", color: "bg-pink-500" },
    { label: "Tím đậm", color: "bg-[#8b5cf6]" },
    { label: "Xanh lơ đậm", color: "bg-[#0891b2]" },
    { label: "Cam đào", color: "bg-[#ffcc99]" },
    { label: "Hồng nhạt", color: "bg-[#ffb6c1]" },
    { label: "Xanh biển sáng", color: "bg-[#20b2aa]", showDivider: true },
    { label: "Mặc định", color: "bg-gray-500" },
];

const CHART_THEME_STORAGE_KEY = "dashboard-chart-theme";
const CHART_THEMES = new Set(THEME_CONFIG.map(t => t.label));

export default function Dashboard() {
    const { authUser, logout } = useAuthStore();
    const [isDark, setIsDark] = useState(false);
    const [hasLoadedTheme] = useState(true);
    const themeTogglerRef = useRef<HTMLButtonElement>(null);

    const { openLayout, setOpenLayout } = useLayoutStore();
    const menuButtonRefs = useRef<Partial<Record<LayoutKey, HTMLButtonElement | null>>>({});

    const [selectedKeys, setSelectedKeys] = useState<Selection>(() => {
        try {
            const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem(CHART_THEME_STORAGE_KEY) : null;
            if (storedTheme && CHART_THEMES.has(storedTheme)) {
                return new Set([storedTheme]);
            }
        } catch (e) {
            console.error("Error loading chart theme from localStorage:", e);
        }
        return new Set(["Default"]);
    });

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys],
    );

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!hasLoadedTheme) {
            return;
        }

        const themeToStore = selectedValue || "Mặc định";
        window.localStorage.setItem(CHART_THEME_STORAGE_KEY, themeToStore);
    }, [selectedValue, hasLoadedTheme]);

    const handleThemeToggle = useCallback(() => {
        themeTogglerRef.current?.click();
    }, []);

    const handleSetLayout = useCallback((layout: LayoutKey) => {
        setOpenLayout(layout);
        menuButtonRefs.current[layout]?.blur();
    }, [setOpenLayout]);

    const getChartColorClass = useCallback((value: string) => {
        return THEME_CONFIG.find(t => t.label === value)?.color || "bg-gray-500";
    }, []);

    return (
        <SidebarProvider>
            <Sidebar
                collapsible="icon"
                className="border-r border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl transition-all duration-500"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className='group hover:bg-zinc-100 dark:hover:bg-white/5 transition-all duration-300 rounded-sm'>
                                <Link href={"/"} className='w-full flex'>
                                    <div className="flex aspect-square size-11 items-center justify-center">
                                        <Image src="/logo.png" alt="Logo" width={40} height={40} />
                                    </div>

                                    <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                                        <span className="font-black tracking-tighter text-lg text-zinc-900 dark:text-white uppercase italic">
                                            MilkyWayyy
                                        </span>
                                        <span className="font-bold text-[10px] tracking-[0.3em] text-amber-500 uppercase opacity-80">
                                            Admin Panel
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className='px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 flex items-center gap-2'>
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Overview
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    ref={(el) => { menuButtonRefs.current['Thống kê'] = el; }}
                                    className={cn(
                                        "h-11 px-3 rounded-sm transition-all duration-300 font-bold text-sm",
                                        openLayout === 'Thống kê'
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 shadow-sm shadow-amber-500/5"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                    )}
                                    onClick={() => handleSetLayout('Thống kê')}
                                >
                                    <ChartColumnDecreasing className={cn("size-2", openLayout === 'Thống kê' && "animate-pulse")} />
                                    <span className="text-sm">Thống kê tổng quan</span>
                                    {openLayout === 'Thống kê' && <div className="ml-auto w-1 h-4 rounded-full bg-amber-500" />}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className='px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 flex items-center gap-2'>
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Quản lý hệ thống
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1">
                            {Management.map((item, index) => {
                                const isActive = openLayout === ManagementLayoutMap[item];
                                return (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton
                                            ref={(el) => { menuButtonRefs.current[ManagementLayoutMap[item]] = el; }}
                                            className={cn(
                                                "h-11 px-3 rounded-sm transition-all duration-300 font-bold text-sm",
                                                isActive
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 shadow-sm shadow-amber-500/5"
                                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                            )}
                                            onClick={() => handleSetLayout(ManagementLayoutMap[item])}
                                        >
                                            <div className={cn("transition-transform duration-300", isActive && "scale-110")}>
                                                {Icon[item]}
                                            </div>
                                            <span>{item}</span>
                                            {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-amber-500" />}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className='px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 flex items-center gap-2'>
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            Cấu hình & Dữ liệu
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1">
                            {[
                                { key: 'Người dùng', icon: <User size={18} />, label: 'Người dùng' },
                                { key: 'Đồng bộ dữ liệu', icon: <Database size={18} />, label: 'Database' },
                                { key: 'Thống kê doanh thu', icon: <ChartColumnDecreasing size={18} />, label: 'Doanh thu' }
                            ].map((item) => {
                                const isActive = openLayout === item.key;
                                return (
                                    <SidebarMenuItem key={item.key}>
                                        <SidebarMenuButton
                                            ref={(el) => { menuButtonRefs.current[item.key as LayoutKey] = el; }}
                                            className={cn(
                                                "h-11 px-3 rounded-sm transition-all duration-300 font-bold text-sm",
                                                isActive
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 shadow-sm shadow-amber-500/5"
                                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                            )}
                                            onClick={() => handleSetLayout(item.key as LayoutKey)}
                                        >
                                            <div className={cn("transition-transform duration-300", isActive && "scale-110")}>
                                                {item.icon}
                                            </div>
                                            <span>{item.label}</span>
                                            {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-amber-500" />}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-4 border-t border-zinc-200/50 dark:border-white/5">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Dropdown>
                                <DropdownTrigger>
                                    <SidebarMenuButton size="lg" className="h-14">
                                        <div className="relative group">
                                            <AvatarElement
                                                authUser={authUser}
                                                width='w-9'
                                                height='h-9'
                                                widthDeco="w-12"
                                                left="left-1/2"
                                                translatex="-translate-x-1/2"
                                            />
                                        </div>

                                        <div className='flex flex-col gap-0.5 text-left ml-2'>
                                            <span className='text-sm font-semibold dark:text-white truncate max-w-30'>{authUser?.username}</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn("w-2 h-2 rounded-full", Number(authUser?.role) === 0 ? "bg-rose-500" : "bg-emerald-500")} />
                                                <span className='text-[10px] font-bold tracking-widest text-zinc-500'>{Number(authUser?.role) === 0 ? 'Admin' : 'Staff'}</span>
                                            </div>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownTrigger>

                                <DropdownMenu variant="flat" className="min-w-50 bg-sidebar">
                                    <DropdownItem key="profile-header" isReadOnly className="h-14 gap-2 opacity-100">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold text-zinc-400">Đang đăng nhập</p>
                                            <p className="text-xs font-semibold truncate">{authUser?.email}</p>
                                        </div>
                                    </DropdownItem>

                                    <DropdownItem
                                        key='home'
                                        startContent={<House size={18} className="text-zinc-400" />}
                                        href="/"
                                        className="font-semibold py-2"
                                    >
                                        Trang chủ
                                    </DropdownItem>

                                    <DropdownItem
                                        key='user'
                                        showDivider
                                        startContent={<User size={18} className="text-zinc-400" />}
                                        href={`/profile/${authUser?.id}`}
                                        className="font-semibold py-2"
                                    >
                                        Hồ sơ cá nhân
                                    </DropdownItem>

                                    <DropdownItem
                                        key='logout'
                                        className="text-rose-500 hover:bg-rose-500/10 font-semibold py-2"
                                        startContent={<LogOut size={18} />}
                                        onClick={logout}
                                    >
                                        Đăng xuất
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-zinc-50/50 dark:bg-zinc-950/50">
                <header className="flex h-20 shrink-0 items-center transition-all duration-300">
                    <div className="flex items-center justify-between gap-4 px-6 w-full">
                        <div className='flex items-center gap-4'>
                            <div className="flex items-center gap-2 p-1 bg-sidebar rounded-sm shadow-sm border border-zinc-200/50 dark:border-white/5">
                                <SidebarTrigger className="hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors" />
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <Breadcrumbs size='lg' isDisabled className="hidden sm:flex opacity-60">
                                    <BreadcrumbItem>Dashboard</BreadcrumbItem>
                                    <BreadcrumbItem>{openLayout}</BreadcrumbItem>
                                </Breadcrumbs>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 p-1.5 bg-sidebar rounded-sm shadow-sm border border-zinc-200/50 dark:border-white/5">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <button className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold transition-all hover:bg-zinc-50 dark:hover:bg-white/5 rounded-sm">
                                            <span className="text-zinc-400 uppercase tracking-widest text-[9px]">Màu Chart</span>
                                            <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-white/10 pl-2.5">
                                                <div className={cn("w-3.5 h-3.5 rounded-full shadow-inner", getChartColorClass(selectedValue))} />
                                                <span className="text-zinc-600 dark:text-zinc-300">{selectedValue}</span>
                                            </div>
                                            <ChevronDown size={14} className="text-zinc-400" />
                                        </button>
                                    </DropdownTrigger>

                                    <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Theme Selection"
                                        selectedKeys={selectedKeys}
                                        selectionMode="single"
                                        variant="flat"
                                        onSelectionChange={setSelectedKeys}
                                        className="bg-sidebar"
                                    >
                                        {THEME_CONFIG.map((theme) => (
                                            <DropdownItem
                                                key={theme.label}
                                                startContent={<div className={`w-3.5 h-3.5 rounded-full ${theme.color} shadow-sm`} />}
                                                showDivider={theme.showDivider}
                                                className="font-bold py-2.5"
                                            >
                                                {theme.label}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>

                                <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-1" />

                                <button
                                    className="p-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-all group"
                                    onClick={handleThemeToggle}
                                    title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                                >
                                    <ThemeToggler className='hidden' ref={themeTogglerRef} />
                                    {isDark
                                        ? <Sun size={20} className="text-amber-500 group-hover:rotate-45 transition-transform" />
                                        : <Moon size={20} className="text-zinc-600 group-hover:-rotate-12 transition-transform" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 pt-0">
                    <div className="h-full rounded-sm bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/5 shadow-2xl shadow-zinc-200/20 dark:shadow-none overflow-hidden relative group">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] -mr-48 -mt-48 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 blur-[100px] -ml-48 -mb-48 pointer-events-none" />

                        <div className="relative z-10 h-full overflow-auto">
                            <LayoutAdmin openLayout={openLayout ?? "Thống kê"} selectValue={selectedValue} />
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

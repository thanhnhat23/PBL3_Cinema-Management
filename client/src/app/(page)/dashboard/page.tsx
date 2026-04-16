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
import { 
    Clapperboard,
    House, 
    Ticket, 
    Drama, 
    MapPinHouse, 
    TicketPercent,
    Speech,
    User,
    ChevronLeft,
    ChartNoAxesGantt,
    Boxes, 
    Sparkles,
    ChartColumnDecreasing,
    TableOfContents,
    Database,
    LogOut,
    MessageCircle,
    Sun,
    Moon,
    ChevronDown,
    Hamburger
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { AvatarElement } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/useAuthStore';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { ThemeToggler } from '@/components/ui/effects/themeToggler';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { LayoutAdmin } from '@/components/layout/layoutAdmin';

const Management = ["Phim", "Phòng", "Vé", "Suất chiếu", "Rạp chiếu", "Khuyến mãi", "Diễn viên", "Review", "Thức ăn"] as const;

type LayoutKey =
    | 'Thống kê'
    | 'Phim'
    | 'Phòng'
    | 'Vé'
    | 'Suất chiếu'
    | 'Rạp chiếu'
    | 'Khuyến mãi'
    | 'Diễn viên'
    | 'Review'
    | 'Người dùng'
    | 'Đồng bộ dữ liệu'
    | 'Thống kê doanh thu'
    | 'Thức ăn';

const ManagementLayoutMap: Record<(typeof Management)[number], LayoutKey> = {
    "Phim": 'Phim',
    "Phòng": 'Phòng',
    "Vé": 'Vé',
    "Suất chiếu": 'Suất chiếu',
    "Rạp chiếu": 'Rạp chiếu',
    "Khuyến mãi": 'Khuyến mãi',
    "Diễn viên": 'Diễn viên',
    "Review": 'Review',
    "Thức ăn": "Thức ăn"
};

const Icon: Record<(typeof Management)[number], ReactNode> = {
  "Phim": <Clapperboard />,
  "Phòng": <House />,
  "Vé": <Ticket />,
  "Suất chiếu": <Drama />,
  "Rạp chiếu": <MapPinHouse />,
  "Khuyến mãi": <TicketPercent />,
  "Diễn viên": <Speech />,
  "Review": <MessageCircle />,
  "Thức ăn": <Hamburger />
};

const CHART_THEME_STORAGE_KEY = "dashboard-chart-theme";
const CHART_THEMES = new Set(["Xanh dương", "Xanh lá", "Vàng", "Đỏ", "Hồng", "Mặc định"]);

export default function Dashboard() {
    const { authUser, logout } = useAuthStore();
    const [isDark, setIsDark] = useState(false);
    const [hasLoadedTheme, setHasLoadedTheme] = useState(false);
    const themeTogglerRef = useRef<HTMLButtonElement>(null);

    const { openLayout, setOpenLayout } = useLayoutStore();
    const menuButtonRefs = useRef<Partial<Record<LayoutKey, HTMLButtonElement | null>>>({});

    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(["Default"]));

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
        const storedTheme = window.localStorage.getItem(CHART_THEME_STORAGE_KEY);
        queueMicrotask(() => {
            if (storedTheme && CHART_THEMES.has(storedTheme)) {
                setSelectedKeys(new Set([storedTheme]));
            }
            setHasLoadedTheme(true);
        });
    }, []);

    useEffect(() => {
        if (!hasLoadedTheme) {
            return;
        }

        const themeToStore = selectedValue || "Mặc định";
        window.localStorage.setItem(CHART_THEME_STORAGE_KEY, themeToStore);
    }, [selectedValue, hasLoadedTheme]);

    const handleThemeToggle = () => {
        themeTogglerRef.current?.click();
    };

    const setMenuButtonRef = (layout: LayoutKey) => (el: HTMLButtonElement | null) => {
        menuButtonRefs.current[layout] = el;
    };

    const handleSetLayout = (layout: LayoutKey) => {
        setOpenLayout(layout);
        menuButtonRefs.current[layout]?.blur();
    };

    const getChartColorClass = (value: string) => {
        switch(value) {
            case "Xanh dương": return "bg-blue-500";
            case "Xanh lá": return "bg-green-500";
            case "Vàng": return "bg-yellow-500";
            case "Đỏ": return "bg-red-500";
            case "Hồng": return "bg-pink-500";
            case "Mặc định": return "bg-gray-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                                <div className="flex aspect-square size-12 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                                </div>

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="font-bold tracking-wide text-base text-neutral-900 dark:text-neutral-100">
                                        Milky Wayyy
                                    </span>
                                    <span className="font-medium text-xs text-neutral-600 dark:text-neutral-400">
                                        Cinema
                                    </span>
                                </div>

                                <Sparkles className="text-fuchsia-400" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Content Sidebar */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className='gap-1'>
                            <TableOfContents />
                            Overview
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                    <SidebarMenuButton
                                        ref={setMenuButtonRef('Thống kê')}
                                        className="text-md font-normal"
                                        onClick={() => handleSetLayout('Thống kê')}
                                    >
                                        <ChartColumnDecreasing />
                                        Thống kê
                                        <ChevronLeft className="ml-auto" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className='gap-1'>
                            <ChartNoAxesGantt />
                            Quản lí tác vụ
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {Management.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton
                                        ref={setMenuButtonRef(ManagementLayoutMap[item])}
                                        className="text-md font-normal"
                                        onClick={() => handleSetLayout(ManagementLayoutMap[item])}
                                    >
                                        {Icon[item]}
                                        {item}
                                        <ChevronLeft className="ml-auto" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className='gap-1'>
                            <Boxes />
                            Khác
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    ref={setMenuButtonRef('Người dùng')}
                                    className="text-md font-normal"
                                    onClick={() => handleSetLayout('Người dùng')}
                                >
                                    <User />
                                    Nguời dùng
                                    <ChevronLeft className="ml-auto" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    ref={setMenuButtonRef('Đồng bộ dữ liệu')}
                                    className="text-md font-normal"
                                    onClick={() => handleSetLayout('Đồng bộ dữ liệu')}
                                >
                                    <Database />
                                    Đồng bộ dữ liệu
                                    <ChevronLeft className="ml-auto" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    ref={setMenuButtonRef('Thống kê doanh thu')}
                                    className="text-md font-normal"
                                    onClick={() => handleSetLayout('Thống kê doanh thu')}
                                >
                                    <ChartColumnDecreasing />
                                    Thống kê doanh thu
                                    <ChevronLeft className="ml-auto" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Dropdown>
                                <DropdownTrigger>
                                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                        <AvatarElement 
                                            authUser={authUser} 
                                            width='w-8'
                                            height='h-8'
                                            widthDeco="w-11"
                                            translatex="-translate-x-1.5"
                                        />

                                        <div className='flex flex-col gap-1 text-left'>
                                            <span className='text-sm font-semibold dark:text-gray-100'>{authUser?.username}</span>
                                            <span className='text-xs dark:text-gray-300'>{authUser?.email}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownTrigger>

                                <DropdownMenu variant="flat">
                                    <DropdownItem key="#" className="flex flex-row" showDivider>
                                        <div className="flex items-center gap-2">
                                            <p className='font-semibold'>Quyền hạn: </p>
                                            <div className={`w-10 h-5 rounded-sm flex items-center justify-center opacity-60 ${Number(authUser?.role) == 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                                                <p className="text-xs text-gray-50">{Number(authUser?.role) == 0 ? 'Admin' : 'Staff'}</p>
                                            </div>
                                        </div>
                                    </DropdownItem>

                                    <DropdownItem
                                        key='home'
                                        startContent={<House size={18} />}
                                        href="/"
                                    >
                                        Trang chủ
                                    </DropdownItem>

                                    <DropdownItem
                                        key='user'
                                        showDivider
                                        startContent={<User size={18} />}
                                        href={`/profile/${authUser?.id}`}
                                    >
                                        Hồ sơ
                                    </DropdownItem>

                                    <DropdownItem 
                                        key='logout'
                                        color="danger" 
                                        className="hover:text-danger"
                                        startContent={<LogOut size={18} />}
                                        href="/"
                                        onClick={() => {
                                            logout();
                                        }}
                                    >
                                        Đăng xuất
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center justify-between gap-2 px-4 w-full">
                        <div className='flex items-center gap-2'>
                            <SidebarTrigger className="-ml-1" />
                            <Breadcrumbs size='lg' isDisabled>
                                <BreadcrumbItem>Dashboard</BreadcrumbItem>
                                <BreadcrumbItem>{openLayout}</BreadcrumbItem>
                            </Breadcrumbs>
                        </div>

                        <div className="flex items-center gap-2">
                            <Dropdown>
                                <DropdownTrigger>
                                    <button className="flex items-center gap-2 rounded-sm bg-sidebar py-2 px-4 text-sm border-1 border-zinc-200 dark:border-zinc-800 shadow-sm">
                                        <p className='font-semibold'>Theme chart: </p> {" "}
                                        <span className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-xs ${getChartColorClass(selectedValue)}`} />
                                            {selectedValue}
                                        </span>
                                        <ChevronDown size={20}/>
                                    </button>
                                </DropdownTrigger>

                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Single selection example"
                                    selectedKeys={selectedKeys}
                                    selectionMode="single"
                                    variant="flat"
                                    onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
                                    classNames={{
                                        base: "bg-sidebar"
                                    }}
                                >
                                    <DropdownItem 
                                        key="Xanh dương"
                                        startContent={<div className="w-3 h-3 rounded-xs bg-blue-500 mr-2" />}
                                    >
                                        Xanh dương
                                    </DropdownItem>

                                    <DropdownItem 
                                        key="Xanh lá"
                                        startContent={<div className="w-3 h-3 rounded-xs bg-green-500 mr-2" />}
                                    >
                                        Xanh lá
                                    </DropdownItem>

                                    <DropdownItem 
                                        key="Vàng"
                                        startContent={<div className="w-3 h-3 rounded-xs bg-yellow-500 mr-2" />}
                                    >
                                        Vàng
                                    </DropdownItem>

                                    <DropdownItem 
                                        key="Đỏ"
                                        startContent={<div className="w-3 h-3 rounded-xs bg-red-500 mr-2" />}
                                    >
                                        Đỏ
                                    </DropdownItem>

                                    <DropdownItem 
                                        key="Hồng"
                                        startContent={<div className="w-3 h-3 rounded-xs bg-pink-500 mr-2" />}
                                        showDivider
                                    >
                                        Hồng
                                    </DropdownItem>

                                    <DropdownItem 
                                        key="Mặc định"
                                        startContent={<div className="w-3 h-3 rounded-xs bg-gray-500 mr-2" />}
                                    >
                                        Mặc định
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <button 
                                className="flex items-center gap-2 rounded-sm bg-sidebar p-2 border-1 border-zinc-200 dark:border-zinc-800 shadow-sm"
                                onClick={handleThemeToggle}
                            >
                                <ThemeToggler className='hidden' ref={themeTogglerRef}/>
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>
                </header>

                <LayoutAdmin openLayout={openLayout ?? "Thống kê"} selectValue={selectedValue} />
            </SidebarInset>
        </SidebarProvider>
    )
}
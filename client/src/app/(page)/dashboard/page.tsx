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
    Utensils,
    Languages
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { AvatarElement } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/useAuthStore';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Breadcrumbs, BreadcrumbItem, Selection, Chip } from '@heroui/react';
import { ThemeToggler } from '@/components/ui/effects/themeToggler';
import { useLayoutStore, type LayoutKey } from '@/stores/useLayoutStore';
import { LayoutAdmin } from '@/components/layout/layoutAdmin';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const Management = ["movies", "tickets", "showtimes", "cinemas", "foods"] as const;

const ManagementLayoutMap: Record<(typeof Management)[number], LayoutKey> = {
    "movies": 'movies',
    "tickets": 'tickets',
    "showtimes": 'showtimes',
    "cinemas": 'cinemas',
    "foods": "foods",
};

const Icon: Record<(typeof Management)[number], ReactNode> = {
    "movies": <Clapperboard size={18} />,
    "tickets": <Ticket size={18} />,
    "showtimes": <Drama size={18} />,
    "cinemas": <MapPinHouse size={18} />,
    "foods": <Utensils size={18} />,
};

const THEME_CONFIG = [
    { key: "blue", label: "Xanh dương", color: "bg-blue-500" },
    { key: "green", label: "Xanh lá", color: "bg-green-500" },
    { key: "yellow", label: "Vàng", color: "bg-yellow-500" },
    { key: "red", label: "Đỏ", color: "bg-red-500" },
    { key: "pink", label: "Hồng", color: "bg-pink-500" },
    { key: "purple", label: "Tím đậm", color: "bg-[#8b5cf6]" },
    { key: "cyan", label: "Xanh lơ đậm", color: "bg-[#0891b2]" },
    { key: "orange", label: "Cam đào", color: "bg-[#ffcc99]" },
    { key: "light_pink", label: "Hồng nhạt", color: "bg-[#ffb6c1]" },
    { key: "teal", label: "Xanh biển sáng", color: "bg-[#20b2aa]", showDivider: true },
    { key: "default", label: "Mặc định", color: "bg-gray-500" },
];

const CHART_THEME_STORAGE_KEY = "dashboard-chart-theme";
const CHART_THEMES = new Set(["blue", "green", "yellow", "red", "pink", "purple", "cyan", "orange", "light_pink", "teal", "default"]);

export default function Dashboard() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { authUser, logout } = useAuthStore();
    const [isDark, setIsDark] = useState(false);
    const themeTogglerRef = useRef<HTMLButtonElement>(null);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        if (typeof window !== 'undefined') {
            document.cookie = `i18next=${lng}; path=/; max-age=31536000; SameSite=Lax`;
            router.refresh();
        }
    };

    const currentLang = (i18n.language || 'vi').startsWith('ja') ? 'ja' : (i18n.language || 'vi').startsWith('en') ? 'en' : 'vi';

    const { openLayout, setOpenLayout } = useLayoutStore();
    const menuButtonRefs = useRef<Partial<Record<LayoutKey, HTMLButtonElement | null>>>({});

    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["default"]) as Selection);
    const DROPDOWN_ITEM_CLASS = "data-[hover=true]:bg-amber-500/10 data-[hover=true]:text-amber-500 font-bold transition-all duration-200";
    
    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys],
    );

    // Load chart theme from localStorage only on client side after hydration
    useEffect(() => {
        try {
            const storedTheme = localStorage.getItem(CHART_THEME_STORAGE_KEY);
            if (storedTheme && CHART_THEMES.has(storedTheme)) {
                setTimeout(() => setSelectedKeys(new Set([storedTheme]) as Selection), 0);
            }
        } catch (e) {
            console.error("Error loading chart theme from localStorage:", e);
        }
    }, []);

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

    const isFirstMount = useRef(true);
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        const themeToStore = selectedValue || "default";
        window.localStorage.setItem(CHART_THEME_STORAGE_KEY, themeToStore);
    }, [selectedValue]);

    const handleThemeToggle = useCallback(() => {
        themeTogglerRef.current?.click();
    }, []);

    const handleSetLayout = useCallback((layout: LayoutKey) => {
        setOpenLayout(layout);
        menuButtonRefs.current[layout]?.blur();
    }, [setOpenLayout]);

    const getChartColorClass = useCallback((value: string) => {
        return THEME_CONFIG.find(t => t.key === value)?.color || "bg-gray-500";
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
                                            {t('dashboard.admin_panel')}
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
                            {t('dashboard.overview')}
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    ref={(el) => { menuButtonRefs.current['stats'] = el; }}
                                    className={cn(
                                        "h-11 px-3 rounded-sm transition-all duration-300 font-bold text-sm",
                                        openLayout === 'stats'
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 shadow-sm shadow-amber-500/5"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                                    )}
                                    onClick={() => handleSetLayout('stats')}
                                >
                                    <ChartColumnDecreasing className={cn("size-2", openLayout === 'stats' && "animate-pulse")} />
                                    <span className="text-sm">{t('dashboard.stats_overview')}</span>
                                    {openLayout === 'stats' && <div className="ml-auto w-1 h-4 rounded-full bg-amber-500" />}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className='px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 flex items-center gap-2'>
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {t('dashboard.system_management')}
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
                                            <span>{t(`dashboard.management.${item}`)}</span>
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
                            {t('dashboard.config_data')}
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1">
                            {[
                                { key: 'users', icon: <User size={18} />, label: t('dashboard.management.users') },
                                { key: 'sync', icon: <Database size={18} />, label: t('dashboard.management.sync') },
                                { key: 'revenue', icon: <ChartColumnDecreasing size={18} />, label: t('dashboard.management.revenue') }
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
                                                <span className='text-[10px] font-bold tracking-widest text-zinc-500'>{Number(authUser?.role) === 0 ? t('users_tab.roles.admin') : t('users_tab.roles.staff')}</span>
                                            </div>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownTrigger>

                                <DropdownMenu variant="flat" className="min-w-50 bg-sidebar">
                                    <DropdownItem key="profile-header" isReadOnly className="h-14 gap-2 opacity-100">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold text-zinc-400">{t('dashboard.logged_in')}</p>
                                            <p className="text-xs font-semibold truncate">{authUser?.email}</p>
                                        </div>
                                    </DropdownItem>

                                    <DropdownItem
                                        key='home'
                                        startContent={<House size={18} className="text-zinc-400" />}
                                        href="/"
                                        className="font-semibold py-2"
                                    >
                                        {t('dashboard.home')}
                                    </DropdownItem>

                                    <DropdownItem
                                        key='user'
                                        showDivider
                                        startContent={<User size={18} className="text-zinc-400" />}
                                        href={`/profile/${authUser?.id}`}
                                        className="font-semibold py-2"
                                    >
                                        {t('dashboard.profile')}
                                    </DropdownItem>

                                    <DropdownItem
                                        key='logout'
                                        className="text-rose-500 hover:bg-rose-500/10 font-semibold py-2"
                                        startContent={<LogOut size={18} />}
                                        onClick={logout}
                                    >
                                        {t('dashboard.logout')}
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
                        <div className='flex items-center gap-2 sm:gap-4'>
                            <div className="flex items-center gap-2 p-1 bg-sidebar rounded-sm shadow-sm border border-zinc-200/50 dark:border-white/5">
                                <SidebarTrigger className="hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors" />
                            </div>

                            <div className="hidden sm:flex gap-0.5">
                                <Breadcrumbs size='lg' isDisabled className="flex opacity-60">
                                    <BreadcrumbItem>{t('navbar.dashboard')}</BreadcrumbItem>
                                    <BreadcrumbItem>{t(`dashboard.management.${openLayout}`)}</BreadcrumbItem>
                                </Breadcrumbs>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 bg-sidebar rounded-sm shadow-sm border border-zinc-200/50 dark:border-white/5">
                                <Dropdown placement="bottom-end" className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl min-w-48">
                                    <DropdownTrigger>
                                        <button className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-sm transition-all group">
                                            <div className="flex items-center gap-2 border-r border-zinc-200 dark:border-white/10 pr-2 sm:pr-3">
                                                <Languages size={16} className="text-amber-500 group-hover:rotate-12 transition-transform duration-500" />
                                                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                                                    {currentLang === 'vi' ? 'VN' : currentLang === 'ja' ? 'JA' : 'EN'}
                                                </span>
                                            </div>
                                            <span className="text-base leading-none">
                                                {currentLang === 'vi' ? '🇻🇳' : currentLang === 'ja' ? '🇯🇵' : '🇺🇸'}
                                            </span>
                                            <ChevronDown size={12} className="text-zinc-400" />
                                        </button>
                                    </DropdownTrigger>
                                    
                                    <DropdownMenu
                                        aria-label="Language selection"
                                        onAction={(key) => changeLanguage(key as string)}
                                        selectedKeys={[currentLang]}
                                        selectionMode="single"
                                        className="p-2"
                                    >
                                        <DropdownItem
                                            key="vi"
                                            textValue="Vietnamese"
                                            startContent={<span className="text-md">🇻🇳</span>}
                                            className={cn(DROPDOWN_ITEM_CLASS, "rounded-lg py-3")}
                                            description="Tiếng Việt"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">Vietnamese</span>
                                                {currentLang === 'vi' && <Chip size="sm" variant="flat" color="warning" className="text-[8px] font-semibold h-5">ACTIVE</Chip>}
                                            </div>
                                        </DropdownItem>

                                        <DropdownItem
                                            key="ja"
                                            textValue="Japanese"
                                            startContent={<span className="text-md">🇯🇵</span>}
                                            className={cn(DROPDOWN_ITEM_CLASS, "rounded-lg py-3")}
                                            description="日本語"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">Japanese</span>
                                                {currentLang === 'ja' && <Chip size="sm" variant="flat" color="warning" className="text-[8px] font-semibold h-5">ACTIVE</Chip>}
                                            </div>
                                        </DropdownItem>

                                        <DropdownItem
                                            key="en"
                                            textValue="English"
                                            startContent={<span className="text-md">🇺🇸</span>}
                                            className={cn(DROPDOWN_ITEM_CLASS, "rounded-lg py-3")}
                                            description="English"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">English</span>
                                                {currentLang === 'en' && <Chip size="sm" variant="flat" color="warning" className="text-[8px] font-semibold h-5">ACTIVE</Chip>}
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-0.5 sm:mx-1" />

                                <Dropdown>
                                    <DropdownTrigger>
                                        <button className="flex items-center gap-1 sm:gap-2.5 px-2 sm:px-4 py-2 text-[10px] sm:text-xs font-bold transition-all hover:bg-zinc-50 dark:hover:bg-white/5 rounded-sm">
                                            <span className="hidden xs:inline text-zinc-400 uppercase tracking-widest text-[9px]">{t('dashboard.chart_color')}</span>
                                            <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-white/10 pl-1 sm:pl-2.5">
                                                <div className={cn("w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full shadow-inner", getChartColorClass(selectedValue))} />
                                                <span className="hidden sm:inline text-zinc-600 dark:text-zinc-300">{t(`dashboard.themes.${selectedValue}`)}</span>
                                            </div>
                                            <ChevronDown size={12} className="text-zinc-400" />
                                        </button>
                                    </DropdownTrigger>
                                    
                                    <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Theme Selection"
                                        selectedKeys={selectedKeys}
                                        selectionMode="single"
                                        variant="flat"
                                        onSelectionChange={(set) => setSelectedKeys(set as Selection)}
                                        className="bg-sidebar"
                                    >
                                        {THEME_CONFIG.map((theme) => (
                                            <DropdownItem
                                                key={theme.key}
                                                textValue={theme.label}
                                                startContent={<div className={`w-3.5 h-3.5 rounded-full ${theme.color} shadow-sm`} />}
                                                showDivider={theme.showDivider}
                                                className="font-bold py-2.5"
                                            >
                                                {t(`dashboard.themes.${theme.key}`)}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>

                                <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-0.5 sm:mx-1" />

                                <button
                                    className="p-1.5 sm:p-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-all group"
                                    onClick={handleThemeToggle}
                                    title={isDark ? t('dashboard.switch_light') : t('dashboard.switch_dark')}
                                >
                                    <ThemeToggler className='hidden' ref={themeTogglerRef} />
                                    {isDark
                                        ? <Sun size={18} className="text-amber-500 group-hover:rotate-45 transition-transform" />
                                        : <Moon size={18} className="text-zinc-600 group-hover:-rotate-12 transition-transform" />
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
                            <LayoutAdmin openLayout={openLayout ?? "stats"} selectValue={selectedValue} />
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

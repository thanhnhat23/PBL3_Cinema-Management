'use client'

import Link from "next/link"
import Image from "next/image";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button,
    Accordion,
    AccordionItem,
    Chip
} from "@heroui/react";
import { Languages } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { UserRound } from "../icons/user-round";
import { Star } from "../icons/star";
import { LogOut } from "../icons/log-out";
import { LayoutDashboard } from "../icons/layout-dashboard";
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { FlameIcon, type FlameIconHandle } from "../icons/flame";
import { Cctv } from "../icons/cctv";
import { TrendingUpIcon } from "../icons/trending-up";
import { ChevronDown } from "../icons/chevron-down";
import { ThemeToggler } from "@/components/ui/effects/themeToggler";
import { SunMedium } from "../icons/sun-medium";
import { Moon } from "../icons/moon";
import { GitHubStarsButton } from "@/components/ui/github-stars";
import { MapPin } from "../icons/map-pin";
import { useAuthStore } from "@/stores/useAuthStore";
import { isAdmin, isStaff } from "@/types";
import i18n from "@/lib/i18n";
import { useCinemaStore } from "@/stores/useCinemaStore";
import { useDialogStore } from "@/stores/useDialogStore";
import { useRouter } from "next/navigation";
import { AvatarElement } from "../ui/avatar";
import { useTranslation } from "react-i18next";

const NAV_LINK_CLASS = "relative text-sm font-semibold tracking-[0.2em] text-zinc-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-amber-500 after:transition-all hover:after:w-full";
const DROPDOWN_ITEM_CLASS = "data-[hover=true]:bg-amber-500/10 data-[hover=true]:text-amber-500 font-bold transition-all duration-200";

export default function NavbarLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const setOpenDialog = useDialogStore(state => state.setOpenDialog);
    const cinemas = useCinemaStore(state => state.cinemas);
    const fetchAllCinemas = useCinemaStore(state => state.fetchAllCinemas);
    const router = useRouter();
    const flameRef = useRef<FlameIconHandle | null>(null);
    const trendingRef = useRef<FlameIconHandle | null>(null);
    const themeTogglerRef = useRef<HTMLButtonElement>(null);

    const authUser = useAuthStore(state => state.authUser);
    const logout = useAuthStore(state => state.logout);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsScrolled(currentScrollY > 20);

            if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (hoveredItem === 'popular') {
            flameRef.current?.startAnimation();
        } else {
            flameRef.current?.stopAnimation();
        }
        if (hoveredItem === 'upcoming') {
            trendingRef.current?.startAnimation();
        } else {
            trendingRef.current?.stopAnimation();
        }
    }, [hoveredItem]);

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
        fetchAllCinemas();
    }, [fetchAllCinemas]);

    const handleThemeToggle = () => {
        themeTogglerRef.current?.click();
    };

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        // Ensure cookie is updated for the server to pick up on refresh
        if (typeof window !== 'undefined') {
            document.cookie = `i18next=${lng}; path=/; max-age=31536000; SameSite=Lax`;
            router.refresh();
        }
    };

    const currentLang = (i18n.language || 'vi').startsWith('ja') ? 'ja' : (i18n.language || 'vi').startsWith('en') ? 'en' : 'vi';

    const desktopMovieItems = [
        {
            key: 'nowplaying',
            label: t('navbar.movies_now'),
            href: '/movies?tab=now-playing',
            icon: <Cctv animate={hoveredItem === 'nowplaying'} size={16} />,
        },
        {
            key: 'upcoming',
            label: t('navbar.movies_upcoming'),
            href: '/movies?tab=coming-soon',
            icon: <TrendingUpIcon ref={trendingRef} size={16} />,
        },
        {
            key: 'popular',
            label: t('navbar.movies_hot'),
            href: '/movies?tab=popular',
            icon: <FlameIcon ref={flameRef} size={16} />,
        },
    ];

    const mobileMovieItems = [
        {
            key: 'nowplaying',
            label: t('navbar.movies_now'),
            href: '/movies?tab=now-playing',
            icon: <Cctv size={16} />,
        },
        {
            key: 'upcoming',
            label: t('navbar.movies_upcoming'),
            href: '/movies?tab=coming-soon',
            icon: <TrendingUpIcon size={16} />,
        },
        {
            key: 'popular',
            label: t('navbar.movies_hot'),
            href: '/movies?tab=popular',
            icon: <FlameIcon size={16} />,
        },
    ];

    return (
        <Navbar
            maxWidth="full"
            position="sticky"
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            className={cn(
                "transition-all duration-300 border-b border-zinc-200 dark:border-white/5",
                isScrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl h-20 shadow-sm dark:shadow-none" : "bg-transparent h-28",
                !isVisible && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
            )}
            classNames={{
                wrapper: "px-6 md:px-12",
                item: "data-[active=true]:text-amber-500",
            }}
        >
            <NavbarContent justify="start" className="gap-8">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-zinc-900 dark:text-white"
                />

                <NavbarBrand className="gap-3">
                    <Link href="/" className="flex items-center justify-start gap-3 group">
                        <div className="relative w-20 h-20">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                sizes="80px"
                                priority
                                className="object-contain"
                            />
                        </div>
                        <div className="hidden md:flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">MilkyWayyy</span>
                            <span className="text-[10px] font-bold tracking-[0.4em] text-amber-500 uppercase">{t('navbar.cinema_experience')}</span>
                        </div>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Navigation */}
            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                <Dropdown className="bg-sidebar backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm">
                    <NavbarItem>
                        <DropdownTrigger>
                            <button
                                className={NAV_LINK_CLASS + " flex items-center gap-1"}
                                onMouseEnter={() => setHoveredItem('phim')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {t('navbar.movies')}
                                <ChevronDown animate={hoveredItem === 'phim'} size={14} />
                            </button>
                        </DropdownTrigger>
                    </NavbarItem>

                    <DropdownMenu aria-label="Movies categories" className="w-50">
                        {desktopMovieItems.map((item) => (
                            <DropdownItem
                                key={item.key}
                                as={Link}
                                startContent={item.icon}
                                className={DROPDOWN_ITEM_CLASS}
                                href={item.href}
                                onMouseEnter={() => setHoveredItem(item.key)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {item.label}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <Dropdown className="bg-sidebar backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm">
                    <NavbarItem>
                        <DropdownTrigger>
                            <button
                                className={NAV_LINK_CLASS + " flex items-center gap-1"}
                                onMouseEnter={() => setHoveredItem('rap')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {t('navbar.cinemas')}
                                <ChevronDown animate={hoveredItem === 'rap'} size={14} />
                            </button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu aria-label="Cinemas list" className="w-55">
                        {cinemas.map((cinema) => (
                            <DropdownItem
                                key={cinema.cinema_id}
                                as={Link}
                                className={DROPDOWN_ITEM_CLASS}
                                startContent={<MapPin animate={hoveredItem === `cinema-${cinema.cinema_id}`} size={16} />}
                                href={`/cinemas/${cinema.cinema_id}`}
                                onMouseEnter={() => setHoveredItem(`cinema-${cinema.cinema_id}`)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {cinema.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <NavbarItem>
                    <Link href="/category" className={NAV_LINK_CLASS}>
                        {t('navbar.categories')}
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/actors" className={NAV_LINK_CLASS}>
                        {t('navbar.actors')}
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/reviews" className={NAV_LINK_CLASS}>
                        {t('navbar.reviews')}
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end" className="gap-6">
                <NavbarItem className="hidden lg:flex">
                    <button
                        onClick={() => {
                            if (!authUser) {
                                setOpenDialog('signin');
                            } else {
                                router.push('/booking');
                            }
                        }}
                        className="text-white px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 rounded-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 flex items-center gap-2"
                    >
                        <BsFillTicketPerforatedFill size={16} />
                        {t('navbar.booking')}
                    </button>
                </NavbarItem>

                {authUser ? (
                    <Dropdown placement="bottom-end" className="bg-sidebar backdrop-blur-xl border border-white/10 rounded-sm">
                        <NavbarItem>
                            <DropdownTrigger>
                                <button className="outline-none transition-transform hover:scale-110 active:scale-95">
                                    <AvatarElement
                                        authUser={authUser}
                                        widthDeco="w-12"
                                        left="left-1/2"
                                        translatex="-translate-x-1/2"
                                    />
                                </button>
                            </DropdownTrigger>
                        </NavbarItem>

                        <DropdownMenu aria-label="User actions" variant="flat" className="w-64">
                            <DropdownItem key="user-info" className="h-14 gap-2 opacity-100" textValue="user info">
                                <p className="text-amber-500">{t('navbar.logged_in_as')} </p>
                                <p className="font-semibold truncate">{authUser.email}</p>
                            </DropdownItem>

                            <DropdownItem
                                key='profile'
                                as={Link}
                                startContent={<UserRound animate={hoveredItem === 'profile'} size={18} />}
                                className={DROPDOWN_ITEM_CLASS}
                                href={`/profile/${authUser.id}`}
                                onMouseEnter={() => setHoveredItem('profile')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {t('navbar.profile')}
                            </DropdownItem>

                            <DropdownItem
                                key='theme'
                                className={DROPDOWN_ITEM_CLASS}
                                startContent={isDark ? <SunMedium size={18} /> : <Moon size={18} />}
                                onClick={handleThemeToggle}
                                showDivider={true}
                            >
                                <ThemeToggler ref={themeTogglerRef} className="hidden" />
                                {t('navbar.theme')}: {isDark ? t('navbar.theme_light') : t('navbar.theme_dark')}
                            </DropdownItem>

                            {authUser && (isStaff(Number(authUser?.role)) || isAdmin(Number(authUser?.role))) ? (
                                <DropdownItem
                                    key='dashboard'
                                    as={Link}
                                    startContent={<LayoutDashboard size={18} />}
                                    className={cn(DROPDOWN_ITEM_CLASS, "text-amber-500")}
                                    href="/dashboard"
                                >
                                    {t('navbar.dashboard')}
                                </DropdownItem>
                            ) : null}

                            <DropdownItem
                                key='ticket'
                                className={DROPDOWN_ITEM_CLASS}
                                startContent={<Star size={18} />}
                                href={`/profile/${authUser.id}?tab=history`}
                                showDivider={true}
                            >
                                {t('navbar.my_tickets')}
                            </DropdownItem>

                            <DropdownItem
                                key='logout'
                                className="text-rose-500 data-[hover=true]:bg-rose-500/10"
                                startContent={<LogOut size={18} />}
                                onClick={() => {
                                    logout();
                                    router.push('/');
                                }}
                            >
                                {t('navbar.logout')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem>
                        <Button
                            className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 rounded-sm"
                            onClick={() => setOpenDialog('signin')}
                        >
                            {t('navbar.login')}
                        </Button>
                    </NavbarItem>
                )}

                <NavbarItem className="hidden xl:flex">
                    <Link
                        href="https://github.com/thanhnhat23/PBL3_Cinema-Management"
                        target="_blank"
                    >
                        <GitHubStarsButton
                            username="thanhnhat23"
                            repo="PBL3_Cinema-Management"
                            variant="ghost"
                            className="cursor-pointer"
                        />
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Dropdown placement="bottom-end" className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl">
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                className="h-10 px-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-2">
                                    <Languages size={16} className="text-amber-500 group-hover:rotate-12 transition-transform duration-500" />
                                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                                        {currentLang === 'vi' ? 'VN' : currentLang === 'ja' ? 'JA' : 'EN'}
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                    <span className="text-base leading-none">
                                        {currentLang === 'vi' ? '🇻🇳' : currentLang === 'ja' ? '🇯🇵' : '🇺🇸'}
                                    </span>
                                </div>
                            </Button>
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
                                startContent={<span className="text-md">🇻🇳</span>}
                                className={cn(DROPDOWN_ITEM_CLASS, "rounded-lg py-3")}
                                description="Tiếng Việt"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">VIETNAMESE</span>
                                    {currentLang === 'vi' && <Chip size="sm" variant="flat" color="warning" className="text-[8px] font-semibold h-5">ACTIVE</Chip>}
                                </div>
                            </DropdownItem>

                            <DropdownItem
                                key="ja"
                                startContent={<span className="text-md">🇯🇵</span>}
                                className={cn(DROPDOWN_ITEM_CLASS, "rounded-lg py-3")}
                                description="日本語"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">JAPANESE</span>
                                    {currentLang === 'ja' && <Chip size="sm" variant="flat" color="warning" className="text-[8px] font-semibold h-5">ACTIVE</Chip>}
                                </div>
                            </DropdownItem>

                            <DropdownItem
                                key="en"
                                startContent={<span className="text-md">🇺🇸</span>}
                                className={cn(DROPDOWN_ITEM_CLASS, "rounded-lg py-3")}
                                description="English"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">ENGLISH</span>
                                    {currentLang === 'en' && <Chip size="sm" variant="flat" color="warning" className="text-[8px] font-semibold h-5">ACTIVE</Chip>}
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>

            {/* Mobile Menu */}
            <NavbarMenu className="bg-white/95 dark:bg-zinc-950/95 pt-12 gap-8 border-t border-zinc-100 dark:border-white/5">
                <NavbarMenuItem>
                    <button
                        className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-600 rounded-sm flex items-center justify-center gap-3 text-white font-semibold tracking-widest"
                        onClick={() => {
                            setIsMenuOpen(false);
                            if (!authUser) {
                                setOpenDialog('signin');
                            } else {
                                router.push('/booking');
                            }
                        }}
                    >
                        <BsFillTicketPerforatedFill size={20} />
                        {t('navbar.buy_tickets_now')}
                    </button>
                </NavbarMenuItem>

                <div className="flex flex-col gap-2">
                    <Accordion
                        variant="light"
                        className="px-0"
                        itemClasses={{
                            title: "text-xl font-semibold tracking-tighter text-zinc-900 dark:text-white",
                            trigger: "px-4 py-3 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-sm transition-all",
                            content: "flex flex-col gap-2 pl-8 pb-4"
                        }}
                    >
                        <AccordionItem key="movies" aria-label="Movies" title={t('navbar.movies')}>
                            {mobileMovieItems.map((item) => (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className="flex items-center gap-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-amber-500 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </AccordionItem>

                        <AccordionItem key="cinemas" aria-label="Cinemas" title={t('navbar.cinemas_system')}>
                            {cinemas.map((cinema) => (
                                <Link
                                    key={cinema.cinema_id}
                                    href={`/cinemas/${cinema.cinema_id}`}
                                    className="flex items-center gap-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-amber-500 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <MapPin size={16} />
                                    {cinema.name}
                                </Link>
                            ))}
                        </AccordionItem>
                    </Accordion>

                    <div className="flex flex-col gap-4 px-4 mt-2">
                        <Link href="/category" className="text-xl font-semibold tracking-tighter hover:text-amber-500 transition-colors" onClick={() => setIsMenuOpen(false)}>{t('navbar.categories')}</Link>
                        <Link href="/actors" className="text-xl font-semibold tracking-tighter hover:text-amber-500 transition-colors" onClick={() => setIsMenuOpen(false)}>{t('navbar.actors')}</Link>
                        <Link href="/reviews" className="text-xl font-semibold tracking-tighter hover:text-amber-500 transition-colors" onClick={() => setIsMenuOpen(false)}>{t('navbar.reviews')}</Link>
                    </div>
                </div>

                <div className="mt-auto pb-12 px-4 flex flex-col gap-4">
                    <div className="w-full h-px bg-white/10" />
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">MilkyWayyy {t('navbar.cinema_experience')}</p>
                </div>
            </NavbarMenu>
        </Navbar>
    )
}
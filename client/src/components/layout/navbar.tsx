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
    AccordionItem
} from "@heroui/react";
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
import { isStaff } from "@/types";
import { useCinemaStore } from "@/stores/useCinemaStore";
import { useDialogStore } from "@/stores/useDialogStore";
import { useRouter } from "next/navigation";
import { AvatarElement } from "../ui/avatar";

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

    const desktopMovieItems = [
        {
            key: 'nowplaying',
            label: 'Phim Đang Chiếu',
            href: '/movies?tab=nowplaying',
            icon: <Cctv animate={hoveredItem === 'nowplaying'} size={16} />,
        },
        {
            key: 'upcoming',
            label: 'Phim Sắp Chiếu',
            href: '/movies?tab=coming-soon',
            icon: <TrendingUpIcon ref={trendingRef} size={16} />,
        },
        {
            key: 'popular',
            label: 'Phim Hot',
            href: '/movies?tab=popular',
            icon: <FlameIcon ref={flameRef} size={16} />,
        },
    ];

    const mobileMovieItems = [
        {
            key: 'nowplaying',
            label: 'Phim Đang Chiếu',
            href: '/movies?tab=now-playing',
            icon: <Cctv size={16} />,
        },
        {
            key: 'upcoming',
            label: 'Phim Sắp Chiếu',
            href: '/movies?tab=coming-soon',
            icon: <TrendingUpIcon size={16} />,
        },
        {
            key: 'popular',
            label: 'Phim Hot',
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

                <NavbarBrand className="gap-3 sm:static absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">
                    <Link href="/" className="flex items-center justify-center gap-3 group">
                        <div className="relative w-20 h-20">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="hidden md:flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">MilkyWayyy</span>
                            <span className="text-[10px] font-bold tracking-[0.4em] text-amber-500 uppercase">Cinema Experience</span>
                        </div>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Navigation */}
            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                <Dropdown className="bg-sidebar backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm">
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={NAV_LINK_CLASS}
                                endContent={<ChevronDown animate={hoveredItem === 'phim'} size={14} />}
                                onMouseEnter={() => setHoveredItem('phim')}
                                onMouseLeave={() => setHoveredItem(null)}
                                radius="none"
                                variant="underlined"
                            >
                                Phim
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    
                    <DropdownMenu aria-label="Movies categories" className="w-50">
                        {desktopMovieItems.map((item) => (
                            <DropdownItem
                                key={item.key}
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
                            <Button
                                disableRipple
                                className={NAV_LINK_CLASS}
                                endContent={<ChevronDown animate={hoveredItem === 'rap'} size={14} />}
                                onMouseEnter={() => setHoveredItem('rap')}
                                onMouseLeave={() => setHoveredItem(null)}
                                radius="none"
                                variant="underlined"
                            >
                                Rạp
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu aria-label="Cinemas list" className="w-55">
                        {cinemas.map((cinema) => (
                            <DropdownItem 
                                key={cinema.cinema_id}
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
                        Thể loại
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/actors" className={NAV_LINK_CLASS}>
                        Diễn viên
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/reviews" className={NAV_LINK_CLASS}>
                        Review
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end" className="gap-6">
                <NavbarItem className="hidden lg:flex">
                    <Link
                        href="/booking"
                        className="text-white px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 rounded-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 flex items-center gap-2"
                    >
                        <BsFillTicketPerforatedFill size={16}/>
                        Đặt vé
                    </Link>
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
                                <p className="text-amber-500">Đăng nhập với: </p>
                                <p className="font-semibold truncate">{authUser.email}</p>
                            </DropdownItem>

                            <DropdownItem 
                                key='profile' 
                                startContent={<UserRound animate={hoveredItem === 'profile'} size={18} />}
                                className={DROPDOWN_ITEM_CLASS}
                                href={`/profile/${authUser.id}`}
                                onMouseEnter={() => setHoveredItem('profile')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Hồ sơ cá nhân
                            </DropdownItem>

                            <DropdownItem
                                key='theme'
                                className={DROPDOWN_ITEM_CLASS}
                                startContent={isDark ? <SunMedium size={18} /> : <Moon size={18} />}
                                onClick={handleThemeToggle}
                                showDivider={true}
                            >
                                <ThemeToggler ref={themeTogglerRef} className="hidden"/>
                                Giao diện: {isDark ? 'Sáng' : 'Tối'}
                            </DropdownItem>

                            {authUser && isStaff(authUser.role) ? (
                                <DropdownItem 
                                    key='dashboard' 
                                    startContent={<LayoutDashboard size={18} />}
                                    className={cn(DROPDOWN_ITEM_CLASS, "text-amber-500")}
                                    href="/dashboard"
                                >
                                    Quản trị hệ thống
                                </DropdownItem>
                            ) : null}

                            <DropdownItem 
                                key='ticket'
                                className={DROPDOWN_ITEM_CLASS}
                                startContent={<Star size={18}/>}
                                href="#"
                                showDivider={true}
                            >
                                Vé đã đặt của tôi
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
                                Đăng xuất
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem>
                        <Button 
                            className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 rounded-sm"
                            onClick={() => setOpenDialog('signin')}
                        >
                            Đăng nhập
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
            </NavbarContent>

            {/* Mobile Menu */}
            <NavbarMenu className="bg-white/95 dark:bg-zinc-950/95 pt-12 gap-8 border-t border-zinc-100 dark:border-white/5">
                <NavbarMenuItem>
                    <Link
                        href="/booking"
                        className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-600 rounded-sm flex items-center justify-center gap-3 text-white font-semibold tracking-widest"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <BsFillTicketPerforatedFill size={20} />
                        Mua vé ngay
                    </Link>
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
                        <AccordionItem key="movies" aria-label="Movies" title="Phim">
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

                        <AccordionItem key="cinemas" aria-label="Cinemas" title="Hệ thống rạp">
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
                        <Link href="/category" className="text-xl font-semibold tracking-tighter hover:text-amber-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Thể loại</Link>
                        <Link href="/actors" className="text-xl font-semibold tracking-tighter hover:text-amber-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Diễn viên</Link>
                        <Link href="/reviews" className="text-xl font-semibold tracking-tighter hover:text-amber-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Review</Link>
                    </div>
                </div>

                <div className="mt-auto pb-12 px-4 flex flex-col gap-4">
                    <div className="w-full h-px bg-white/10" />
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">MilkyWayyy Cinema Experience</p>
                </div>
            </NavbarMenu>
        </Navbar>
    )
}
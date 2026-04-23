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
    Button
} from "@heroui/react";
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
import { useCinemaStore } from "@/stores/useCinemaStore";
import { useDialogStore } from "@/stores/useDialogStore";
import { useRouter } from "next/navigation";
import { AvatarElement } from "../ui/avatar";

const NAV_BUTTON_CLASS = "group p-0 text-base bg-transparent data-[hover=true]:bg-transparent font-semibold dark:hover:text-zinc-300 hover:text-zinc-600";
const MOBILE_BUTTON_CLASS = "group text-lg bg-transparent data-[hover=true]:bg-transparent dark:hover:text-zinc-300 hover:text-zinc-600";

export default function NavbarLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(false);
    const { setOpenDialog } = useDialogStore();
    const { cinemas, fetchAllCinemas } = useCinemaStore();
    const router = useRouter();
    const flameRef = useRef<FlameIconHandle | null>(null);
    const trendingRef = useRef<FlameIconHandle | null>(null);
    const themeTogglerRef = useRef<HTMLButtonElement>(null);

    const { authUser, logout } = useAuthStore();

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
        <Navbar shouldHideOnScroll isBordered onMenuOpenChange={setIsMenuOpen} classNames={{ base: 'md:py-8'}}>
            <NavbarContent justify="start">

                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />

                <NavbarBrand className="mr-14 hidden sm:block">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="sm:font-bold text-inherit text-2xl inline-block"
                        >
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={250}
                                height={250}
                                className="object-fill min-w-18 w-18 md:min-w-36 md:w-36"
                            />
                        </Link>
                    </div>
                </NavbarBrand>
            </NavbarContent>

            {/* Logo for mobile view */}
            <NavbarContent justify="center" className="sm:hidden">
                <NavbarBrand>
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={250}
                            height={250}
                            className="object-fill w-18 h-auto"
                        />
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* For desktop view */}
            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={NAV_BUTTON_CLASS}
                                endContent={<ChevronDown animate={hoveredItem === 'phim'} size={16} />}
                                onMouseEnter={() => setHoveredItem('phim')}
                                onMouseLeave={() => setHoveredItem(null)}
                                radius="sm"
                                variant="light"
                            >
                                Phim
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu>
                        {desktopMovieItems.map((item) => (
                            <DropdownItem
                                key={item.key}
                                startContent={item.icon}
                                className="group"
                                href={item.href}
                                onMouseEnter={() => setHoveredItem(item.key)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {item.label}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <NavbarItem>
                    <Link href="/category"
                        className={NAV_BUTTON_CLASS}
                    >
                        Thể loại
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/actors"
                        className={NAV_BUTTON_CLASS}
                    >
                        Diễn viên
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/reviews"
                        className={NAV_BUTTON_CLASS}
                    >
                        Review
                    </Link>
                </NavbarItem>

                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={NAV_BUTTON_CLASS}
                                endContent={<ChevronDown animate={hoveredItem === 'rap'} size={16} />}
                                onMouseEnter={() => setHoveredItem('rap')}
                                onMouseLeave={() => setHoveredItem(null)}
                                radius="sm"
                                variant="light"
                            >
                                Rạp
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu aria-label="Category menu">
                        {cinemas.map((cinema) => (
                            <DropdownItem 
                                key={cinema.cinema_id}
                                className="group"
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

                <Link
                    href="#"
                    className="text-base bg-transparent data-[hover=true]:bg-transparent text-white font-semibold dark:hover:text-zinc-50 hover:text-zinc-50"
                >
                    <NavbarItem className="flex flex-row gap-2 items-center bg-orange-400 dark:bg-orange-500 p-2 font-semibold dark:hover:bg-orange-600 hover:bg-orange-500 rounded-md">
                            <BsFillTicketPerforatedFill size={18}/>
                            Mua vé
                    </NavbarItem>
                </Link>
            </NavbarContent>

            <NavbarContent justify="end">
                {authUser ? (
                    <Dropdown>
                        <NavbarItem className="sm:pl-10 pl-0">
                            <DropdownTrigger>
                                <div>
                                    <AvatarElement 
                                        authUser={authUser} 
                                        widthDeco="w-13" 
                                        translatex="-translate-x-1.5"
                                    />
                                </div>
                            </DropdownTrigger>
                        </NavbarItem>

                        <DropdownMenu aria-label="User menu" variant="flat">
                            <DropdownItem key="#" className="h-14 gap-2" showDivider>
                                <p className="font-semibold">Đăng nhập với</p>
                                <p>{authUser.email}</p>
                            </DropdownItem>

                            <DropdownItem 
                                key='profile' 
                                startContent={<UserRound animate={hoveredItem === 'profile'} size={18} />}
                                className="group"
                                href={`/profile/${authUser.id}`}
                                onMouseEnter={() => setHoveredItem('profile')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Hồ sơ
                            </DropdownItem>

                            <DropdownItem
                                key='theme-toggler'
                                className="group"
                                startContent={isDark ? <SunMedium animate={hoveredItem === 'theme-toggler'} size={18} /> 
                                            : <Moon animate={hoveredItem === 'theme-toggler'} size={18} />}
                                onMouseEnter={() => setHoveredItem('theme-toggler')}
                                onMouseLeave={() => setHoveredItem(null)}
                                onClick={handleThemeToggle}
                            >
                                <ThemeToggler ref={themeTogglerRef} className="hidden"/>
                                Đổi theme
                            </DropdownItem>

                            {Number(authUser.role) < 2 ? (
                                <DropdownItem 
                                    key='dashboard' 
                                    startContent={<LayoutDashboard animate={hoveredItem === 'dashboard'} size={18} />}
                                    showDivider
                                    className="group"
                                    href="/dashboard"
                                    onMouseEnter={() => setHoveredItem('dashboard')}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    Dashboard
                                </DropdownItem>
                            ) : null}

                            <DropdownItem 
                                key='ticket'
                                color="warning"
                                showDivider
                                className="hover:text-warning group"
                                startContent={<Star animate={hoveredItem === 'ticket'} size={18}/>}
                                href="#"
                                onMouseEnter={() => setHoveredItem('ticket')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Vé của tôi
                            </DropdownItem>
                            
                            <DropdownItem 
                                key='logout' 
                                color="danger" 
                                className="hover:text-danger"
                                startContent={<LogOut animate={hoveredItem === 'logout'} size={18} />}
                                href="#"
                                onMouseEnter={() => setHoveredItem('logout')}
                                onMouseLeave={() => setHoveredItem(null)}
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
                            variant="ghost"
                            onClick={() => setOpenDialog('signin')}
                        >
                            Đăng nhập
                        </Button>
                    </NavbarItem>
                )}

                <NavbarItem className="ml-4 sm:inline-block hidden">
                    <Link
                        href="https://github.com/thanhnhat23/PBL3_Cinema-Management"
                        className="flex items-center justify-center text-black dark:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHubStarsButton username="thanhnhat23" repo="PBL3_Cinema-Management" variant="ghost"/>
                    </Link>
                </NavbarItem>
            </NavbarContent>

            {/* For mobile view */}
            <NavbarMenu>
                <NavbarMenuItem className="flex flex-col gap-2">
                    <Link
                        href="#"
                        className="flex flex-row gap-2 items-center bg-orange-400 dark:bg-orange-500 rounded-md p-2 justify-center text-base data-[hover=true]:bg-transparent text-white font-semibold dark:hover:text-zinc-50 hover:text-zinc-50"
                    >
                        <BsFillTicketPerforatedFill size={18} />
                        Mua vé
                    </Link>
                </NavbarMenuItem>
                
                
                <Dropdown>
                    <NavbarMenuItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={MOBILE_BUTTON_CLASS}
                                endContent={<ChevronDown size={16} />}
                                radius="sm"
                                variant="light"
                            >
                                Phim
                            </Button>
                        </DropdownTrigger>
                    </NavbarMenuItem>
                    <DropdownMenu>
                        {mobileMovieItems.map((item) => (
                            <DropdownItem
                                key={item.key}
                                startContent={item.icon}
                                className="group text-md"
                                href={item.href}
                            >
                                {item.label}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

            
                <NavbarMenuItem>
                    <Link href="/category"
                        className={`${MOBILE_BUTTON_CLASS} flex items-center px-3.5`}
                    >
                        Thể loại
                    </Link>
                </NavbarMenuItem>

                <NavbarMenuItem className="p-2 pl-4">
                    <Link href="/actors" className="text-lg">
                        Diễn viên
                    </Link>
                </NavbarMenuItem>

                <NavbarMenuItem className="p-2 pl-4">
                    <Link href="/reviews" className="text-lg">
                        Review
                    </Link>
                </NavbarMenuItem>

                <Dropdown>
                    <NavbarMenuItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={MOBILE_BUTTON_CLASS}
                                endContent={<ChevronDown animate={hoveredItem === 'theloai'} size={16} />}
                                onMouseEnter={() => setHoveredItem('theloai')}
                                onMouseLeave={() => setHoveredItem(null)}
                                radius="sm"
                                variant="light"
                            >
                                Rạp
                            </Button>
                        </DropdownTrigger>
                    </NavbarMenuItem>
                    <DropdownMenu aria-label="Category menu">
                        {cinemas.map((cinema) => (
                            <DropdownItem 
                                key={cinema.cinema_id}
                                className="group text-md"
                                startContent={<MapPin animate={hoveredItem === `cinema-mobile-${cinema.cinema_id}`} size={16} />}
                                href={`/cinemas/${cinema.cinema_id}`}
                                onMouseEnter={() => setHoveredItem(`cinema-mobile-${cinema.cinema_id}`)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {cinema.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </NavbarMenu>
        </Navbar>
    )
}
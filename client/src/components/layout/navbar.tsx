'use client'

import Link from "next/link"
import { 
    Avatar,
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
import { ChevronRight } from "../icons/chevron-right";
import { ThemeToggler } from "@/components/ui/effects/themeToggler";
import { SunMedium } from "../icons/sun-medium";
import { Moon } from "../icons/moon";
import { GitHubStarsButton } from "@/components/ui/github-stars";
import { MapPin } from "../icons/map-pin";
import { useAuthStore } from "@/stores/useAuthStore";
import { FormLayout } from './buttonForm';
import { Image } from "@heroui/react";

export default function NavbarLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(false);
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

    const handleThemeToggle = () => {
        themeTogglerRef.current?.click();
    };

    const cinema = [
        'MilkyWayyy Đà Nẵng', 'MilkyWayyy - HaNoi Center', 'MilkyWayyy HCM',
        'MilkyWayyy AeonMall Huế', 'MilkyWayyy Vinh', 'MilkyWayyy Plaza Hải Phòng',
        'MilkyWayyy Nha Trang VinCom', 'MilkyWayyy J97 Centrer'
    ]

    const key = [
        'adventure', 'fantasy', 'animation', 'drama', 'horror', 'action',
        'comedy', 'history', 'western', 'thriller', 'crime', 'documentary',
        'sciencefiction', 'mystery', 'music', 'romance', 'family', 'war', 'tvshow'
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
                                isBlurred
                                src="/logo.png"
                                alt="Logo"
                                className="object-fill min-w-18 w-18 md:min-w-36 md:w-36"
                            />
                        </Link>
                    </div>
                </NavbarBrand>
            </NavbarContent>

            {/* Logo for mobile view (centered) */}
            <NavbarContent justify="center" className="sm:hidden">
                <NavbarBrand>
                    <Link href="/">
                        <Image
                            isBlurred
                            src="/logo.png"
                            alt="Logo"
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
                                className="group p-0 text-base bg-transparent data-[hover=true]:bg-transparent font-semibold dark:hover:text-zinc-300 hover:text-zinc-600"
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
                        <DropdownItem 
                            key='nowplaying'
                            startContent={<Cctv animate={hoveredItem === 'nowplaying'} size={16} />}
                            className="group"
                            href="/movies?tab=nowplaying"
                            onMouseEnter={() => setHoveredItem('nowplaying')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            Phim Đang Chiếu
                        </DropdownItem>

                        <DropdownItem 
                            key='upcoming'
                            startContent={<TrendingUpIcon ref={trendingRef} size={16} />}
                            className="group"
                            href="/movies?tab=coming-soon"
                            onMouseEnter={() => setHoveredItem('upcoming')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            Phim Sắp Chiếu
                        </DropdownItem>

                        <DropdownItem 
                            key='popular'
                            startContent={<FlameIcon ref={flameRef} size={16} />}
                            className="group"
                            href="/movies?tab=popular"
                            onMouseEnter={() => setHoveredItem('popular')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            Phim Hot
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                {/* <Dropdown> */}
                    <NavbarItem>
                        {/* <DropdownTrigger> */}
                            <Button
                                disableRipple
                                className="group p-0 text-base bg-transparent data-[hover=true]:bg-transparent font-semibold dark:hover:text-zinc-300 hover:text-zinc-600"
                                radius="sm"
                                variant="light"
                            >
                                Thể loại
                            </Button>
                        {/* </DropdownTrigger> */}
                    </NavbarItem>
                    {/* <DropdownMenu 
                        aria-label="Category menu"
                        classNames={{
                            list: "grid grid-cols-3 gap-0 w-150"
                        }}
                    >
                        {categorys.map((category, index) => (
                            <DropdownItem 
                                key={key[index]}
                                className="group"
                                startContent={<ChevronRight animate={hoveredItem === key[index]} size={16} />}
                                href="#"
                                onMouseEnter={() => setHoveredItem(key[index])}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {category}
                            </DropdownItem>
                        ))}
                    </DropdownMenu> */}
                {/* </Dropdown> */}

                <NavbarItem>
                    <Link href="#"
                        className="p-0 text-base bg-transparent data-[hover=true]:bg-transparent font-semibold dark:hover:text-zinc-300 hover:text-zinc-600"
                    >
                        Diễn viên
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="#"
                        className="p-0 text-base bg-transparent data-[hover=true]:bg-transparent font-semibold dark:hover:text-zinc-300 hover:text-zinc-600"
                    >
                        Review
                    </Link>
                </NavbarItem>

                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="group text-base bg-transparent data-[hover=true]:bg-transparent font-semibold dark:hover:text-zinc-300 hover:text-zinc-600"
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
                        {cinema.map((cinema, index) => (
                            <DropdownItem 
                                key={key[index]}
                                className="group"
                                startContent={<MapPin animate={hoveredItem === key[index]} size={16} />}
                                href="#"
                                onMouseEnter={() => setHoveredItem(key[index])}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {cinema}
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
                                <Avatar 
                                    isBordered 
                                    as="button"
                                    color="primary" 
                                    size="sm"
                                    src={authUser.avatar || "https://i.pinimg.com/1200x/dc/00/eb/dc00ebc8d85a3cf802aecb502cf7e212.jpg"} 
                                />
                            </DropdownTrigger>
                        </NavbarItem>

                        <DropdownMenu aria-label="User menu" variant="flat">
                            <DropdownItem key="#" className="h-14 gap-2">
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

                            <DropdownItem 
                                key='dashboard' 
                                startContent={<LayoutDashboard animate={hoveredItem === 'dashboard'} size={18} />}
                                showDivider
                                className="group"
                                href="#"
                                onMouseEnter={() => setHoveredItem('dashboard')}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Dashboard
                            </DropdownItem>

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
                                onClick={() => logout()}
                            >
                                Đăng xuất
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem>
                        <FormLayout />
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
                                className="group text-lg bg-transparent data-[hover=true]:bg-transparent dark:hover:text-zinc-300 hover:text-zinc-600"
                                endContent={<ChevronDown size={16} />}
                                radius="sm"
                                variant="light"
                            >
                                Phim
                            </Button>
                        </DropdownTrigger>
                    </NavbarMenuItem>
                    <DropdownMenu>
                        <DropdownItem 
                            key='nowplaying'
                            startContent={<Cctv size={16} />}
                            className="group text-md"
                            href="/movies?tab=now-playing"
                        >
                            Phim Đang Chiếu
                        </DropdownItem>

                        <DropdownItem 
                            key='upcoming'
                            startContent={<TrendingUpIcon size={16} />}
                            className="group text-md"
                            href="/movies?tab=coming-soon"
                        >
                            Phim Sắp Chiếu
                        </DropdownItem>

                        <DropdownItem 
                            key='popular'
                            startContent={<FlameIcon size={16} />}
                            className="group text-md"
                            href="/movies?tab=popular"
                        >
                            Phim Hot
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                
                {/* <Dropdown> */}
                    <NavbarMenuItem>
                        {/* <DropdownTrigger> */}
                            <Button
                                disableRipple
                                className="group text-lg bg-transparent data-[hover=true]:bg-transparent dark:hover:text-zinc-300 hover:text-zinc-600"
                                endContent={<ChevronDown size={16} />}
                                radius="sm"
                                variant="light"
                            >
                                Thể loại
                            </Button>
                        {/* </DropdownTrigger> */}
                    </NavbarMenuItem>
                    {/* <DropdownMenu 
                        aria-label="Category menu"
                        classNames={{
                            list: "grid grid-cols-2 gap-0 max-h-100"
                        }}
                    >
                        {categorys.map((category, index) => (
                            <DropdownItem 
                                key={key[index]}
                                className="group text-md"
                                startContent={<ChevronRight size={16} />}
                                href="#"
                                onMouseEnter={() => setHoveredItem(key[index])}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {category}
                            </DropdownItem>
                        ))}
                    </DropdownMenu> */}
                {/* </Dropdown> */}

                <NavbarMenuItem className="p-2 pl-4">
                    <Link href="#" className="text-lg">
                        Diễn viên
                    </Link>
                </NavbarMenuItem>

                <Dropdown>
                    <NavbarMenuItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="group text-lg"
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
                        {cinema.map((cinema, index) => (
                            <DropdownItem 
                                key={key[index]}
                                className="group text-md"
                                startContent={<MapPin animate={hoveredItem === key[index]} size={16} />}
                                href="#"
                                onMouseEnter={() => setHoveredItem(key[index])}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {cinema}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </NavbarMenu>
        </Navbar>
    )
}
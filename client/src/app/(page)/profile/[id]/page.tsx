'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { Button, Accordion, AccordionItem, Tabs, Tab, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Settings } from "@/components/icons/settings";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { UserRound } from "@/components/icons/user-round";
import { HistoryIcon, type HistoryIconHandle } from "@/components/icons/history";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { MdPassword } from "react-icons/md";
import { useDialogStore } from "@/stores/useDialogStore";
import { CircleCheck } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { AvatarElement } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useBookingStore, type Booking } from "@/stores/useBookingStore";
import { useMovieStore } from "@/stores/useMovieStore";
import { Calendar, MapPin, CreditCard, ChevronRight, Ticket, Clock, Info, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { authUser } = useAuthStore();
  const { t } = useTranslation();
  type DialogAction = 'change-email' | 'change-birthdate' | 'settings' | 'change-password';
  const { fetchUserById, user } = useUserStore();
  const searchParams = useSearchParams();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { setOpenDialog } = useDialogStore();
  const historyRef = useRef<HistoryIconHandle>(null);

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const tabParam = searchParams.get('tab');
  const [selectedTab, setSelectedTab] = useState<string>(() => {
      if (tabParam && ['info', 'history'].includes(tabParam)) {
          return tabParam;
      }
      return 'info';
  });

  useEffect(() => {
    if (hoveredItem === 'history') {
        historyRef.current?.startAnimation();
    } else {
        historyRef.current?.stopAnimation();
    }
  }, [hoveredItem]);

  const { fetchAllBookings, bookings, isFetchingBookings } = useBookingStore();
  const { movies, fetchAllMovies } = useMovieStore();
  const userBookings = bookings.filter(b => b.user_id === id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);

  const handleViewDetail = (booking: Booking) => {
    setSelectedBookingForDetail(booking);
    onOpen();
  };

  useEffect(() => {
    if (!id || id === "tmdb-user") return;
    fetchUserById(id);
    if (authUser?.id === id) {
        fetchAllBookings();
        fetchAllMovies();
    }
  }, [id, fetchUserById, fetchAllBookings, fetchAllMovies, authUser]);

    return (
        <>
        <div className="min-h-screen bg-background pb-20 pt-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar: Profile Overview */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-8 shadow-2xl border border-white/20 dark:border-white/5 flex flex-col items-center">
                            <div className="relative group mb-6">
                                <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-amber-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                                <AvatarElement 
                                    user={user} 
                                    width="w-28" 
                                    height="h-28" 
                                    left="left-1/2" 
                                    translatex="-translate-x-1/2" 
                                    widthDeco="w-34"
                                />
                                
                                {authUser?.id === id && (
                                    <Button 
                                        size="sm"
                                        radius="full"
                                        variant="shadow"
                                        isIconOnly
                                        className="absolute -bottom-2 -right-2 z-20 bg-amber-500 text-white shadow-xl hover:scale-110 active:scale-95"
                                        onClick={() => setOpenDialog('settings')}
                                    >
                                        <Settings size={14} />
                                    </Button>
                                )}
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <h1 className="text-2xl font-black tracking-tight uppercase">{user?.username}</h1>
                                    {Number(user?.role) === 0 ? (
                                        <BadgeCheck size={20} className="text-rose-500"/>
                                    ) : Number(user?.role) === 1 ? (
                                        <CircleCheck size={20} className="text-emerald-500"/>
                                    ) : null}
                                </div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    {Number(user?.role) === 0 ? t('profile.roles.admin') : t('profile.roles.member')}
                                </p>
                            </div>

                            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-8" />

                            <div className="w-full space-y-6">
                                {(() => {
                                    const totalSpending = userBookings
                                        .filter(b => String(b.status) === "1" || String(b.status).toLowerCase() === "success")
                                        .reduce((sum, b) => sum + b.finalAmount, 0);
                                    
                                    const ranks = [
                                        { name: t('profile.ranks.bronze'), min: 0, max: 1000000, color: "from-orange-700 to-orange-500" },
                                        { name: t('profile.ranks.silver'), min: 1000001, max: 2500000, color: "from-zinc-400 to-zinc-300" },
                                        { name: t('profile.ranks.gold'), min: 2500001, max: 5000000, color: "from-amber-500 to-yellow-300" },
                                        { name: t('profile.ranks.platinum'), min: 5000001, max: 10000000, color: "from-cyan-400 to-blue-300" },
                                        { name: t('profile.ranks.diamond'), min: 10000001, max: 20000000, color: "from-indigo-500 to-purple-400" }
                                    ];

                                    const currentRank = ranks.find(r => totalSpending <= r.max) || ranks[ranks.length - 1];
                                    const nextRank = ranks[ranks.indexOf(currentRank) + 1] || null;

                                    return (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                    {t('profile.spending_year', { year: new Date().getFullYear() })}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                                        {t('profile.loyalty_point')} {Math.floor(totalSpending / 10000)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress 
                                                value={totalSpending} 
                                                maxValue={currentRank.max}
                                                size="md"
                                                classNames={{
                                                    indicator: `bg-gradient-to-r ${currentRank.color}`,
                                                    track: "bg-zinc-100 dark:bg-zinc-800"
                                                }}
                                            />
                                            <div className="flex justify-between mt-2">
                                                <span className="text-xs font-bold">{totalSpending.toLocaleString()}{t('profile.currency')}</span>
                                                <span className="text-xs font-black uppercase italic text-amber-500">
                                                    {t('profile.rank')}: {currentRank.name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-6 shadow-xl border border-white/20 dark:border-white/5 flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2 px-1">{t('profile.project_info')}</h3>
                                <Accordion selectionMode="multiple" className="px-0">
                                    <AccordionItem 
                                        key="1" 
                                        aria-label="Hotline support" 
                                        title={<span className="text-xs font-bold uppercase tracking-wider">{t('profile.hotline')}</span>}
                                        className="border-none"
                                    >
                                        <Link href="tel:19002310" className="text-xs font-bold text-amber-500 hover:underline">1900 2310</Link>
                                    </AccordionItem>

                                    <AccordionItem 
                                        key="2" 
                                        aria-label="Email support" 
                                        title={<span className="text-xs font-bold uppercase tracking-wider">{t('profile.email_support')}</span>}
                                        className="border-none"
                                    >
                                        <Link href="mailto:milkywayyy@cinema.me" className="text-xs font-bold text-amber-500 hover:underline">milkywayyy@cinema.me</Link>
                                    </AccordionItem>

                                    <AccordionItem 
                                        key="3" 
                                        aria-label="Source web" 
                                        title={<span className="text-xs font-bold uppercase tracking-wider">{t('profile.source_web')}</span>}
                                        className="border-none"
                                    >
                                        <Link href="https://github.com/thanhnhat23/PBL3_Cinema-Management" className="text-xs font-bold text-amber-500 hover:underline">{t('profile.project_name')}</Link>
                                    </AccordionItem>

                                    <AccordionItem 
                                        key="4" 
                                        aria-label="About us" 
                                        title={<span className="text-xs font-bold uppercase tracking-wider">{t('profile.about_us.title')}</span>}
                                        className="border-none"
                                    >
                                        <div className="text-[11px] text-zinc-500 leading-relaxed font-medium space-y-2">
                                            <p>- {t('profile.about_us.p1')}</p>
                                            <p>- {t('profile.about_us.p2')}</p>
                                            <p>- {t('profile.about_us.p3')}</p>
                                            <p>- {t('profile.about_us.p4')}</p>
                                        </div>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Info & Tabs */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-2xl rounded-sm p-8 shadow-2xl border border-white/20 dark:border-white/5">
                            <div className="mb-8 flex justify-center">
                                <Tabs 
                                    key="tabs"
                                    aria-label="Profile navigation" 
                                    variant="underlined" 
                                    selectedKey={selectedTab}
                                    onSelectionChange={(key) => setSelectedTab(key as string)}
                                    classNames={{
                                        tabList: "gap-8 relative rounded-none p-0 border-b border-divider justify-center",
                                        cursor: "w-full bg-amber-500 h-1",
                                        tab: "max-w-fit px-0 h-12",
                                        tabContent: "group-data-[selected=true]:text-amber-500 font-bold text-sm md:text-base transition-colors duration-300"
                                    }}
                                >
                                    <Tab key="info" title={
                                        <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('info')} onMouseLeave={() => setHoveredItem(null)}>
                                            <UserRound animate={hoveredItem === 'info'} size={18} />
                                            <span>{t('profile.tabs.personal_info')}</span>
                                        </div>
                                    } />

                                    {authUser?.id === id && (
                                        <Tab key="history" title={
                                            <div className="flex items-center gap-2" onMouseEnter={() => setHoveredItem('history')} onMouseLeave={() => setHoveredItem(null)}>
                                                <HistoryIcon ref={historyRef} size={18} />
                                                <span>{t('profile.tabs.booking_history')}</span>
                                            </div>
                                        } />
                                    )}
                                </Tabs>
                            </div>

                            {selectedTab === "info" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Info Cards */}
                                    {[
                                        { label: t('profile.info_labels.full_name'), value: user?.username, icon: <FaUser size={16} /> },
                                        { label: t('profile.info_labels.email'), value: user?.email, icon: <IoIosMail size={18} />, action: 'change-email' },
                                        { label: t('profile.info_labels.join_date'), value: user?.createdAt ? new Date(user?.createdAt).toLocaleDateString(t('language') === 'ja' ? 'ja-JP' : 'vi-VN') : 'N/A', icon: <MdDateRange size={18} /> },
                                        { label: t('profile.info_labels.birthdate'), value: user?.birthDate ? new Date(user.birthDate).toLocaleDateString(t('language') === 'ja' ? 'ja-JP' : 'vi-VN') : 'N/A', icon: <MdDateRange size={18} />, action: 'change-birthdate' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="group relative">
                                            <p className="text-xs font-bold text-zinc-500 mb-2 px-1">{item.label}</p>
                                            <div className="flex items-center justify-between p-4 rounded-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 transition-all duration-300 group-hover:border-amber-500/30 group-hover:bg-amber-500/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-amber-500 transition-colors">
                                                        {item.icon}
                                                    </div>
                                                    <span className="text-xs md:text-sm font-semibold text-zinc-700 dark:text-zinc-200">{item.value || t('profile.info_labels.no_data')}</span>
                                                </div>
                                                {authUser?.id === id && item.action && (
                                                    <Button 
                                                        isIconOnly 
                                                        size="sm" 
                                                        radius="lg" 
                                                        variant="light" 
                                                        className="text-amber-500 hover:bg-amber-500/10"
                                                        onClick={() => setOpenDialog(item.action as DialogAction)}
                                                    >
                                                        <FiEdit3 size={14}/>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="md:col-span-2">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-1">{t('profile.account_status')}</p>
                                        <div className={`flex items-center gap-4 p-4 rounded-sm border transition-all duration-300 ${user?.isVerified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                                            <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${user?.isVerified ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                                                <FaUserCheck size={18} />
                                            </div>
                                            <div>
                                                <span className={`text-sm font-black uppercase tracking-tight ${user?.isVerified ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {user?.isVerified ? t('profile.verified') : t('profile.unverified')}
                                                </span>
                                                <p className="text-[10px] font-medium text-zinc-400">
                                                    {user?.isVerified ? t('profile.verified_desc') : t('profile.unverified_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {authUser?.id === id && (
                                        <div className="md:col-span-2">
                                             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-1">{t('profile.security')}</p>
                                             <div className="flex items-center justify-between p-4 rounded-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-white/10 flex items-center justify-center text-zinc-400">
                                                        <MdPassword size={20} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-xs md:text-sm">{t('profile.password_protection')}</span>
                                                        <span className="text-[10px] text-zinc-400 tracking-[0.3em]">●●●●●●●●●●●●</span>
                                                    </div>
                                                </div>
                                                <Button 
                                                    radius="lg" 
                                                    variant="flat" 
                                                    size="sm"
                                                    className="font-semibold text-xs md:text-sm px-3 md:px-6"
                                                    color="warning"
                                                    onClick={() => setOpenDialog('change-password')}
                                                >
                                                    {t('profile.change_password')}
                                                </Button>
                                             </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedTab === "history" && authUser?.id === id && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <h3 className="text-sm font-black uppercase tracking-widest">{t('profile.tabs.booking_history')}</h3>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                            {userBookings.length} {t('profile.total_bookings')}
                                        </span>
                                    </div>

                                    {isFetchingBookings ? (
                                        <div className="space-y-4 animate-pulse">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-sm" />
                                            ))}
                                        </div>
                                    ) : userBookings.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {userBookings.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()).map((booking) => {
                                                const fallbackMovie = booking.movieTitle === 'N/A' && booking.movie_id 
                                                    ? movies.find(m => m.movie_id === booking.movie_id) 
                                                    : null;
                                                const displayTitle = fallbackMovie?.title || booking.movieTitle;
                                                const displayPoster = fallbackMovie?.poster_path || booking.posterPath;

                                                return (
                                                    <div 
                                                        key={booking.booking_id} 
                                                        className="group relative flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-zinc-800/30 rounded-sm border border-zinc-100 dark:border-white/5 hover:border-amber-500/30 transition-all duration-300"
                                                    >
                                                        <div className="relative w-32 h-48 mx-auto sm:mx-0 sm:w-24 sm:h-36 shrink-0 rounded-sm overflow-hidden shadow-lg border border-white/10 bg-zinc-200 dark:bg-zinc-800">
                                                            <Image
                                                                src={displayPoster ? `https://image.tmdb.org/t/p/w185${displayPoster}` : "/h.png"}
                                                                alt={displayTitle || "Movie Poster"}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        </div>

                                                        <div className="flex-1 flex flex-col justify-between py-1">
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                                                    <h4 className="text-lg font-black uppercase italic tracking-tighter leading-none group-hover:text-amber-500 transition-colors">
                                                                        {displayTitle}
                                                                    </h4>
                                                                    <span className={cn(
                                                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-center",
                                                                        String(booking.status) === "1" || String(booking.status).toLowerCase() === "success" 
                                                                            ? "bg-emerald-500/10 text-emerald-500" 
                                                                            : String(booking.status) === "2" 
                                                                                ? "bg-rose-500/10 text-rose-500" 
                                                                                : "bg-amber-500/10 text-amber-500"
                                                                    )}>
                                                                        {String(booking.status) === "1" || String(booking.status).toLowerCase() === "success" 
                                                                            ? t('payment.callback.success') 
                                                                            : String(booking.status) === "2" 
                                                                                ? t('payment.callback.failed') 
                                                                                : t('payment.callback.pending')}
                                                                    </span>
                                                                </div>

                                                            <div className="flex flex-wrap gap-4 items-center">
                                                                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                                                    <MapPin size={12} className="text-amber-500" />
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">{booking.cinemaName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                                                    <Calendar size={12} className="text-amber-500" />
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                                                        {new Date(booking.startTime || booking.createAt).toLocaleDateString(t('language') === 'ja' ? 'ja-JP' : 'vi-VN')}
                                                                        {" • "}
                                                                        {new Date(booking.startTime || booking.createAt).toLocaleTimeString(t('language') === 'ja' ? 'ja-JP' : 'vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
                                                            <div className="flex items-center gap-2">
                                                                <CreditCard size={14} className="text-zinc-400" />
                                                                <span className="text-lg font-black text-zinc-900 dark:text-white">
                                                                    {booking.finalAmount.toLocaleString()}{t('profile.currency')}
                                                                </span>
                                                            </div>
                                                            <Button 
                                                                size="sm" 
                                                                variant="light" 
                                                                className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] hover:text-amber-500"
                                                                endContent={<ChevronRight size={14} />}
                                                                onClick={() => handleViewDetail(booking)}
                                                            >
                                                                {t('profile.view_details')}
                                                            </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300">
                                                <HistoryIcon size={40} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tight">{t('profile.tabs.booking_history')}</h3>
                                                <p className="text-sm text-zinc-500 max-w-xs mx-auto">{t('profile.no_transactions')}</p>
                                            </div>
                                            <Link href="/movies" className="mt-4 px-10 py-3 rounded-full bg-amber-500 text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20">
                                                {t('profile.explore_now')}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            backdrop="blur"
            className="p-0 overflow-hidden"
            classNames={{
                base: "bg-sidebar border-white/5",
                header: "border-b border-zinc-100 dark:border-white/5",
                footer: "border-t border-zinc-100 dark:border-white/5",
                closeButton: "hover:bg-zinc-100 dark:hover:bg-white/5"
            }}
        >
            <ModalContent>
                {(onClose) => {
                    if (!selectedBookingForDetail) return null;
                    return (
                        <>
                            <ModalHeader className="flex gap-2 px-6 py-4">
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-amber-500">
                                    {t('payment.callback.order_info')}
                                </h2>

                                <p className="text-zinc-500 dark:text-zinc-400">#{selectedBookingForDetail.booking_id}</p>
                            </ModalHeader>

                            <ModalBody className="p-0 gap-0">
                                <div className="p-6 space-y-6">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-32 h-48 rounded-sm overflow-hidden shadow-2xl shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-white/10 relative">
                                            <Image 
                                                src={selectedBookingForDetail.posterPath ? `https://image.tmdb.org/t/p/w500${selectedBookingForDetail.posterPath}` : '/placeholder-movie.jpg'} 
                                                alt={selectedBookingForDetail.movieTitle || 'Movie Poster'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-1 flex flex-col gap-2">
                                                <h3 className="text-md font-black uppercase tracking-tight leading-none italic">{selectedBookingForDetail.movieTitle}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                                                        (String(selectedBookingForDetail.status) === "1" || String(selectedBookingForDetail.status).toLowerCase() === "success") 
                                                        ? 'bg-emerald-500/10 text-emerald-500' 
                                                        : 'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                        <CheckCircle2 size={10} />
                                                        {(String(selectedBookingForDetail.status) === "1" || String(selectedBookingForDetail.status).toLowerCase() === "success") 
                                                            ? t('payment.callback.success') 
                                                            : t('payment.callback.failed')}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t('common.date')}</span>
                                                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                        <Calendar size={12} className="text-amber-500" />
                                                        <p className="text-xs font-bold">{new Date(selectedBookingForDetail.createAt).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t('payment.callback.txn_ref')}</span>
                                                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                        <Info size={12} className="text-amber-500" />
                                                        <p className="text-xs font-bold">CM-{selectedBookingForDetail.booking_id + 88776}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-amber-500">
                                            <Ticket size={16} />
                                            <h4 className="text-[10px] font-black uppercase tracking-widest">{t('booking.selection.selected_showtime')}</h4>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 relative overflow-hidden group">
                                            <div className="space-y-4 relative z-10">
                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t('booking.selection.cinema')} & {t('booking.selection.room')}</span>
                                                        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                                            <MapPin size={12} className="text-amber-500" />
                                                            <p className="text-xs font-semibold italic tracking-tight">{selectedBookingForDetail.cinemaName} - {selectedBookingForDetail.roomName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t('booking.selection.showtime')}</span>
                                                        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                                            <Clock size={12} className="text-amber-500" />
                                                            <p className="text-xs font-semibold">
                                                                {new Date(selectedBookingForDetail.startTime || selectedBookingForDetail.createAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                                {" - "}
                                                                {new Date(selectedBookingForDetail.startTime || selectedBookingForDetail.createAt).toLocaleDateString('vi-VN')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t('booking.sidebar.selected_seats')}</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedBookingForDetail.seats && selectedBookingForDetail.seats.length > 0 ? (
                                                                selectedBookingForDetail.seats.map(seat => (
                                                                    <span key={seat} className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-sm">
                                                                        {seat}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-zinc-500 italic">{t('common.none')}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center justify-center p-2 rounded-sm shadow-inner group-hover:scale-105 transition-transform duration-500">
                                                <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">{t('booking.sidebar.ticket_qr')}</span>
                                                <div className="relative w-28 h-28 bg-white rounded-sm">
                                                    <Image 
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TICKET-${selectedBookingForDetail.booking_id}`}
                                                        alt="QR Code"
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-amber-500">
                                            <CreditCard size={16} />
                                            <h4 className="text-[10px] font-black uppercase tracking-widest">{t('booking.confirmation.title')}</h4>
                                        </div>
                                        <div className="p-4 rounded-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-500">{t('booking.confirmation.subtotal')}</span>
                                                    <span className="font-bold">{selectedBookingForDetail.totalAmount.toLocaleString()} VNĐ</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-rose-500">
                                                    <span className="font-medium">{t('booking.confirmation.discount')}</span>
                                                    <span className="font-bold">-{(selectedBookingForDetail.discountAmount || 0).toLocaleString()} VNĐ</span>
                                                </div>
                                                <div className="flex justify-between text-sm border-t border-zinc-100 dark:border-white/5 pt-2">
                                                    <span className="text-zinc-500">{t('booking.confirmation.payment_method_label')}</span>
                                                    <span className="font-bold uppercase italic text-zinc-900 dark:text-zinc-100">
                                                        {selectedBookingForDetail.paymentMethod || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="pt-2 border-t border-zinc-100 dark:border-white/5 flex justify-between">
                                                    <span className="text-md font-black uppercase italic tracking-tighter">{t('booking.confirmation.total_payable')}</span>
                                                    <span className="text-xl font-black text-amber-500 italic">
                                                        {selectedBookingForDetail.finalAmount.toLocaleString()} VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="p-6 pt-0">
                                <Button 
                                    className="dark:bg-white dark:text-black bg-zinc-900 text-white font-black uppercase italic tracking-widest text-[10px] rounded-sm h-12 w-full"
                                    onPress={onClose}
                                >
                                    {t('common.close')}
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
        </>
    );
}

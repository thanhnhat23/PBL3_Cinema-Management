'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { Button, Accordion, AccordionItem, Tabs, Tab, Progress } from "@heroui/react";
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

  useEffect(() => {
    if (!id || id === "tmdb-user") return;
    fetchUserById(id);
  }, [id, fetchUserById]);

    return (
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
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('profile.spending_year', { year: new Date().getFullYear() })}</span>
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{t('profile.loyalty_point')} 250</span>
                                    </div>
                                    <Progress 
                                        value={1000000} 
                                        maxValue={4000000}
                                        size="md"
                                        classNames={{
                                            indicator: "bg-gradient-to-r from-orange-400 to-amber-600",
                                            track: "bg-zinc-100 dark:bg-zinc-800"
                                        }}
                                    />
                                    <div className="flex justify-between mt-2">
                                        <span className="text-xs font-bold">1,000,000{t('profile.currency')}</span>
                                        <span className="text-xs font-medium text-zinc-400 italic">{t('profile.rank')} {t('profile.ranks.silver')}</span>
                                    </div>
                                </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

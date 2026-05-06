"use client";

import { 
    ChartColumnDecreasing, 
    Clapperboard,
    MessageCircle,
    Speech,
    Grid,
    TrendingUp,
    ShieldUser,
    Sparkles,
    ChevronRight,
    type LucideIcon
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/effects/number-ticker';
import { ChartPieCard } from '../Chart/ChartPieCard';
import { ChartBarCard } from '../Chart/ChartBarCard';
import { ChartLineCard } from '../Chart/ChartLineCard';
import { ChartAreaCard } from '../Chart/ChartAreaCard';
import { useAdminStore } from '@/stores/useAdminStore';
import { useEffect, useMemo, useCallback } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { AvatarElement } from './../../ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from "react-i18next";

type MetricCard = {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
};

const changeThemeColorChart = (value: string) => {
    switch(value) {             
        case "blue": return {
            pie: ["#2563eb", "#3b82f6", "#60a5fa"] as [string, string, string],
            chart: "#2563eb"
        };

        case "green": return {
            pie: ["#22c55e", "#4ade80", "#86efac"] as [string, string, string],
            chart: "#22c55e"
        };

        case "yellow": return {
            pie: ["#f59e0b", "#fbbf24", "#fcd34d"] as [string, string, string],
            chart: "#f59e0b"
        };

        case "red": return {
            pie: ["#ef4444", "#f87171", "#fca5a5"] as [string, string, string],
            chart: "#ef4444"
        };

        case "pink": return {
            pie: ["#ec4899", "#f472b6", "#f9a8d4"] as [string, string, string],
            chart: "#ec4899"
        };

        case "purple": return {
            pie: ["#8b5cf6", "#a78bfa", "#c4b5fd"] as [string, string, string],
            chart: "#8b5cf6"
        };

        case "cyan": return {
            pie: ["#0891b2", "#06b6d4", "#22d3ee"] as [string, string, string],
            chart: "#0891b2"
        };

        case "orange": return {
            pie: ["#ffcc99", "#ffd1a9", "#ffd8b9"] as [string, string, string],
            chart: "#ffcc99"
        };

        case "light_pink": return {
            pie: ["#ffb6c1", "#ffc0cb", "#ffd1dc"] as [string, string, string],
            chart: "#ffb6c1"
        };

        case "teal": return {
            pie: ["#20b2aa", "#48d1cc", "#40e0d0"] as [string, string, string],
            chart: "#20b2aa"
        };
        
        default: return {
            pie: ["#6b7280", "#9ca3af", "#d1d5db"] as [string, string, string],
            chart: "#6b7280"
        };
    }
}

export const LayoutOverview = ({ selectValue }: { selectValue: string }) => {
    const { t } = useTranslation();
    const {
        totalMovies,
        totalReviews,
        totalActors,
        totalGenres,
        movieStatusCounts,
        movieMonthlyCounts,
        movieGenreCounts,
        fetchDashboardData,
    } = useAdminStore();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const { users, fetchAllUsers } = useUserStore();

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const isAdminOrStaffUser = useCallback((role: string) => {
        const normalized = String(role).toLowerCase();
        return normalized === 'admin' || normalized === 'staff' || normalized === '0' || normalized === '1';
    }, []);

    const getRoleLabel = useCallback((role: string) => {
        const normalized = String(role).toLowerCase();
        return normalized === 'admin' || normalized === '0' ? 'Admin' : 'Staff';
    }, []);

    const adminOrStaffUsers = useMemo(() => {
        return users.filter((user) => isAdminOrStaffUser(user.role));
    }, [users, isAdminOrStaffUser]);

    const chartColors = useMemo(() => changeThemeColorChart(selectValue), [selectValue]);

    const barChartData = useMemo(() => movieMonthlyCounts.map((item) => ({
        month: item.monthName,
        movie: item.total,
    })), [movieMonthlyCounts]);

    const areaChartData = useMemo(() => movieGenreCounts.map((item) => ({
        genre: item.genre,
        movie: item.movie,
    })), [movieGenreCounts]);

    const metricCards = useMemo<MetricCard[]>(() => ([
        {
            title: t('dashboard.overview_tab.metrics.movies.title'),
            value: totalMovies,
            description: t('dashboard.overview_tab.metrics.movies.desc'),
            icon: Clapperboard,
        },
        {
            title: t('dashboard.overview_tab.metrics.reviews.title'),
            value: totalReviews,
            description: t('dashboard.overview_tab.metrics.reviews.desc'),
            icon: MessageCircle,
        },
        {
            title: t('dashboard.overview_tab.metrics.actors.title'),
            value: totalActors,
            description: t('dashboard.overview_tab.metrics.actors.desc'),
            icon: Speech,
        },
        {
            title: t('dashboard.overview_tab.metrics.genres.title'),
            value: totalGenres,
            description: t('dashboard.overview_tab.metrics.genres.desc'),
            icon: Grid,
        },
    ]), [t, totalActors, totalGenres, totalMovies, totalReviews]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <ChartColumnDecreasing size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Management System
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('dashboard.overview_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('dashboard.overview_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2'>
                {metricCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div key={card.title} className='w-full shadow-md rounded-lg flex flex-col border-1 border-zinc-200 dark:border-zinc-800 bg-sidebar p-4'>
                            <div className="flex justify-start gap-2 cursor-default">
                                <div className='flex items-center justify-center gap-2'>
                                    <Icon size={18} />
                                    <p className='font-semibold text-xl '>{card.title}</p>
                                </div>
                            </div>

                            <div className="h-full flex items-center justify-center gap-2 cursor-default p-6">
                                <div className='flex items-start justify-center gap-2'>
                                    <NumberTicker
                                        value={card.value}
                                        className="text-6xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
                                    />
                                    <TrendingUp size={24} />
                                </div>
                            </div>

                            <div className="flex flex-col items-start justify-center gap-1 cursor-default">
                                <p className='font-semibold'>{t('dashboard.overview_tab.metrics.stat_label', { item: card.title })} </p>
                                <p className='text-sm text-gray-500'>{card.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
                <ChartPieCard 
                    color={chartColors.pie} 
                    data={movieStatusCounts}
                />

                <ChartBarCard
                    color={chartColors.chart}
                    data={barChartData}
                />
            </div>

            <div className='grid grid-cols-1 gap-2'>
                <ChartAreaCard color={chartColors.chart} data={areaChartData} />
            </div>

            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                <div className='rounded-xl flex flex-col justify-start border-1 border-zinc-200 dark:border-zinc-800 bg-sidebar overflow-hidden shadow-sm'>
                    <div className='w-full px-6 py-5 border-b-1 border-zinc-100 dark:border-zinc-800 flex items-center justify-between'>
                        <div className='flex flex-col gap-0.5'>
                            <h3 className='flex items-center gap-2 font-bold text-lg'>
                                <div className='p-1.5 rounded-lg bg-red-500/10 text-red-500'>
                                    <ShieldUser size={18} />
                                </div>
                                {t('dashboard.overview_tab.admin_team.title')}
                            </h3>
                            <p className='text-xs text-neutral-400'>{t('dashboard.overview_tab.admin_team.desc')}</p>
                        </div>
                        <div className='flex -space-x-2'>
                            {adminOrStaffUsers.slice(0, 4).map((user, i) => (
                                <div key={i} className='w-7 h-7 rounded-full border-2 border-sidebar overflow-hidden'>
                                    <Image
                                        src={user.avatar_path || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username} 
                                        className='w-full h-full object-cover' 
                                        alt="" 
                                        width={28}
                                        height={28}
                                    />
                                </div>
                            ))}
                            {adminOrStaffUsers.length > 4 && (
                                <div className='w-7 h-7 rounded-full border-2 border-sidebar bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold'>
                                    +{adminOrStaffUsers.length - 4}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='w-full p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar' style={{ maxHeight: '400px' }}>
                        {adminOrStaffUsers.map((user, index) => {
                            const isAdmin = getRoleLabel(user.role) === 'Admin';

                            return (
                                <div 
                                    key={index} 
                                    className='group w-full flex items-center justify-between gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border-1 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800'
                                >
                                    <div className='flex items-center gap-3'>
                                        <Link href={`/profile/${user.user_id}`} className='relative group/avatar'>
                                            <AvatarElement 
                                                user={user}
                                                width="w-10" 
                                                height="h-10" 
                                                left="left-1/2" 
                                                translatex="-translate-x-1/2" 
                                                widthDeco="w-13"
                                            />
                                            {isAdmin && (
                                                <div className='absolute -bottom-1 -right-1 bg-red-500 text-white p-0.5 rounded-full border-2 border-sidebar z-20'>
                                                    <Sparkles size={10} />
                                                </div>
                                            )}
                                        </Link>

                                        <div className='flex flex-col'>
                                            <p className='font-bold text-sm group-hover:text-red-500 transition-colors'>{user.username}</p>
                                            <p className='text-[11px] text-neutral-400'>{user.email || t('dashboard.overview_tab.admin_team.system_cinema')}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            isAdmin 
                                            ? 'bg-red-500/10 text-red-500 border-1 border-red-500/20' 
                                            : 'bg-blue-500/10 text-blue-500 border-1 border-blue-500/20'
                                        }`}>
                                            {getRoleLabel(user.role)}
                                        </span>
                                        <Link href={`/profile/${user.user_id}`} className='p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer'>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>    
                </div>

                <ChartLineCard color={chartColors.chart} />
            </div>
        </div>
    )
}
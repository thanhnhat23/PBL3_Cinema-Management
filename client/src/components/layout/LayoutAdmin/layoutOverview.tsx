"use client";

import { 
    ChartColumnDecreasing, 
    Clapperboard,
    MessageCircle,
    Speech,
    Grid,
    TrendingUp,
    ShieldUser,
    type LucideIcon
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/effects/number-ticker';
import { ChartPieCard } from '../Chart/ChartPieCard';
import { ChartBarCard } from '../Chart/ChartBarCard';
import { ChartLineCard } from '../Chart/ChartLineCard';
import { ChartAreaCard } from '../Chart/ChartAreaCard';
import { useAdminStore } from '@/stores/useAdminStore';
import { useEffect, useMemo } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { AvatarElement } from './../../ui/avatar';
import Link from 'next/link';

type MetricCard = {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
};

export const LayoutOverview = ({ selectValue }: { selectValue: string }) => {
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

    const isAdminOrStaffUser = (role: string) => {
        const normalized = String(role).toLowerCase();
        return normalized === 'admin' || normalized === 'staff' || normalized === '0' || normalized === '1';
    };

    const getRoleLabel = (role: string) => {
        const normalized = String(role).toLowerCase();
        return normalized === 'admin' || normalized === '0' ? 'Admin' : 'Staff';
    };

    const adminOrStaffUsers = useMemo(() => {
        return users.filter((user) => isAdminOrStaffUser(user.role));
    }, [users]);

    const changeThemeColorChart = (value: string) => {
        switch(value) {             
            case "Xanh dương": return {
                pie: ["#2563eb", "#3b82f6", "#60a5fa"] as [string, string, string],
                chart: "#2563eb"
            };

            case "Xanh lá": return {
                pie: ["#22c55e", "#4ade80", "#86efac"] as [string, string, string],
                chart: "#22c55e"
            };

            case "Vàng": return {
                pie: ["#f59e0b", "#fbbf24", "#fcd34d"] as [string, string, string],
                chart: "#f59e0b"
            };

            case "Đỏ": return {
                pie: ["#ef4444", "#f87171", "#fca5a5"] as [string, string, string],
                chart: "#ef4444"
            };

            case "Hồng": return {
                pie: ["#ec4899", "#f472b6", "#f9a8d4"] as [string, string, string],
                chart: "#ec4899"
            };
            
            default: return {
                pie: ["#6b7280", "#9ca3af", "#d1d5db"] as [string, string, string],
                chart: "#6b7280"
            };
        }
    }

    const chartColors = changeThemeColorChart(selectValue);

    const metricCards = useMemo<MetricCard[]>(() => ([
        {
            title: 'Phim',
            value: totalMovies,
            description: 'Tổng số lượng phim trong database',
            icon: Clapperboard,
        },
        {
            title: 'Đánh giá',
            value: totalReviews,
            description: 'Tổng số lượng đánh giá trong database',
            icon: MessageCircle,
        },
        {
            title: 'Diễn viên',
            value: totalActors,
            description: 'Tổng số lượng diễn viên trong database',
            icon: Speech,
        },
        {
            title: 'Thể loại',
            value: totalGenres,
            description: 'Tổng số lượng thể loại trong database',
            icon: Grid,
        },
    ]), [totalActors, totalGenres, totalMovies, totalReviews]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <ChartColumnDecreasing />
                Dashboard: Thống kê tổng quan
            </h1>
            
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
                                <p className='font-semibold'>Thống kê {card.title.toLowerCase()} </p>
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
                    data={movieMonthlyCounts.map((item) => ({
                        month: item.monthName,
                        movie: item.total,
                    }))}
                />
            </div>

            <div className='grid grid-cols-1 gap-2'>
                <ChartAreaCard color={chartColors.chart} data={movieGenreCounts.map((item) => ({
                    genre: item.genre,
                    movie: item.movie,
                }))} />
            </div>

            <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
                <div className='shadow-md rounded-lg flex flex-col justify-start border-1 border-zinc-200 dark:border-zinc-800 bg-sidebar py-1 px-6'>
                    <div className='w-full h-24 flex flex-col items-start justify-center gap-2'>
                        <p className='flex items-center justify-center gap-2 font-bold text-xl'>
                            <ShieldUser size={20} />
                            Quản trị viên
                        </p>
                        <p className='text-sm text-neutral-400'>Các quản trị viên của hệ thống</p>
                    </div>

                    <div className='w-full max-h-96 overflow-y-auto flex flex-col justify-center items-center gap-4'>
                        {adminOrStaffUsers.map((user, index) => {
                            const isAdmin = getRoleLabel(user.role) === 'Admin';

                            return (
                                <div 
                                    key={index} 
                                    className='w-full flex items-center justify-start gap-4 p-4 rounded-md shadow-sm bg-neutral-100 dark:bg-neutral-800 border-1 border-zinc-200 dark:border-zinc-700'
                                >
                                    <Link href={`/profile/${user.user_id}`}>
                                        <AvatarElement 
                                            user={user}
                                            width="w-12" 
                                            height="h-12" 
                                            left="left-1/2" 
                                            translatex="-translate-x-1/2" 
                                            widthDeco="w-15"
                                        />
                                    </Link>

                                    <div className='flex items-center justify-center gap-2'>
                                        <p className='font-semibold'>{user.username}</p>
                                        <span className={`${isAdmin ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-medium px-2 py-0.5 rounded`}>
                                            {getRoleLabel(user.role)}
                                        </span>
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
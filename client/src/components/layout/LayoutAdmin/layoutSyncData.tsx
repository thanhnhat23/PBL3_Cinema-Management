'use client';

import {
    CloudSync,
    Play,
    Pause,
    Settings,
    MessageCircle,
    Flame,
    TrendingUp,
    Film,
    Loader2,
    AlertCircle,
    Clock,
    DatabaseZap
} from "lucide-react";
import { useSyncDateStore } from "@/stores/useSyncDataStore";
import { useState, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Progress, Button, Tooltip, Badge } from "@heroui/react";
import { useTranslation } from "react-i18next";

type SyncKind = "movie" | "review" | "status";
type MovieSyncStatus = "upcoming" | "nowplaying" | "popular";

type SyncMovieKey = "isSyncingUpcomingMovie" | "isSyncingNowPlayingMovie" | "isSyncingPopularMovie";

type SyncItem = {
    name: string;
    description: string;
    icon: ReactNode;
    kind: SyncKind;
    movieStatus?: MovieSyncStatus;
    loadingKey: SyncMovieKey | "isSyncingReviewMovie" | "isSyncingStatusMovie";
    action: () => Promise<void>;
    color: "primary" | "success" | "warning" | "secondary" | "default";
};

export default function LayoutSyncData() {
    const { t } = useTranslation();
    const [activeSyncName, setActiveSyncName] = useState<string | null>(null);

    const {
        syncMovie,
        syncStatusMovie,
        syncReviewMovie,
        stopSync,
        isSyncingUpcomingMovie,
        isSyncingNowPlayingMovie,
        isSyncingPopularMovie,
        isSyncingReviewMovie,
        isSyncingStatusMovie
    } = useSyncDateStore();

    const getSyncStatus = (item: SyncItem) => {
        if (item.loadingKey === "isSyncingUpcomingMovie") return { loading: isSyncingUpcomingMovie, type: "upcoming" as const };
        if (item.loadingKey === "isSyncingNowPlayingMovie") return { loading: isSyncingNowPlayingMovie, type: "nowplaying" as const };
        if (item.loadingKey === "isSyncingPopularMovie") return { loading: isSyncingPopularMovie, type: "popular" as const };
        if (item.loadingKey === "isSyncingReviewMovie") return { loading: isSyncingReviewMovie, type: "review" as const };
        return { loading: isSyncingStatusMovie, type: "status" as const };
    };

    const handleSyncData = (item: SyncItem) => async () => {
        const { loading, type } = getSyncStatus(item);

        if (loading) {
            stopSync(type);
            setActiveSyncName(null);
            return;
        }

        try {
            setActiveSyncName(item.name);
            await item.action();
        } catch (error) {
            console.error("Error syncing data:", error);
        } finally {
            setActiveSyncName(null);
        }
    };

    const syncItems: SyncItem[] = useMemo(() => [
        {
            name: t('sync_tab.tasks.upcoming.name'),
            description: t('sync_tab.tasks.upcoming.desc'),
            icon: <TrendingUp size={20} />,
            kind: "movie",
            movieStatus: "upcoming",
            loadingKey: "isSyncingUpcomingMovie",
            color: "primary",
            action: () => syncMovie("upcoming")
        },
        {
            name: t('sync_tab.tasks.nowplaying.name'),
            description: t('sync_tab.tasks.nowplaying.desc'),
            icon: <Film size={20} />,
            kind: "movie",
            movieStatus: "nowplaying",
            color: "success",
            loadingKey: "isSyncingNowPlayingMovie",
            action: () => syncMovie("nowplaying")
        },
        {
            name: t('sync_tab.tasks.popular.name'),
            description: t('sync_tab.tasks.popular.desc'),
            icon: <Flame size={20} />,
            kind: "movie",
            movieStatus: "popular",
            color: "warning",
            loadingKey: "isSyncingPopularMovie",
            action: () => syncMovie("popular")
        },
        {
            name: t('sync_tab.tasks.reviews.name'),
            description: t('sync_tab.tasks.reviews.desc'),
            icon: <MessageCircle size={20} />,
            kind: "review",
            color: "secondary",
            loadingKey: "isSyncingReviewMovie",
            action: () => syncReviewMovie()
        },
        {
            name: t('sync_tab.tasks.status.name'),
            description: t('sync_tab.tasks.status.desc'),
            icon: <Settings size={20} />,
            kind: "status",
            color: "default",
            loadingKey: "isSyncingStatusMovie",
            action: () => syncStatusMovie()
        }
    ], [syncMovie, syncReviewMovie, syncStatusMovie, t]);

    return (
        <div className="flex flex-col gap-8 p-1">
            {/* --- Premium Header Section --- */}
            <div className="relative overflow-hidden rounded-sm border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-8 shadow-2xl transition-all">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <Badge content="Stable" color="success" variant="flat" size="sm" className="font-black tracking-widest text-[9px] uppercase px-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                                 <DatabaseZap size={12} className="text-amber-500" />
                                 {t('sync_tab.status.integration')}
                             </div>
                        </Badge>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                                <CloudSync size={36} className="text-amber-500" />
                                {t('sync_tab.title')}
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-xl leading-relaxed">
                                {t('sync_tab.desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Sync Tasks Grid --- */}
            <div className="grid gap-6 xl:grid-cols-2">
                {syncItems.map((item) => {
                    const { loading } = getSyncStatus(item);

                    return (
                        <div
                            key={item.name}
                            className={cn(
                                "group relative overflow-hidden rounded-sm border p-1 transition-all duration-500",
                                loading 
                                    ? "border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/10" 
                                    : "border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-xl"
                            )}
                        >
                            {/* Loading Shine Effect */}
                            {loading && (
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
                            )}

                            <div className="relative z-10 p-5 space-y-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-110",
                                            loading 
                                                ? "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/30 animate-pulse" 
                                                : "bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-white/10 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-400 group-hover:shadow-lg group-hover:shadow-amber-500/20"
                                        )}>
                                            {loading ? <Loader2 className="animate-spin" size={24} /> : item.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{item.name}</h3>
                                                {loading && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
                                            </div>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    <Tooltip content={loading ? t('sync_tab.status.stop') : t('sync_tab.status.start')}>
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            size="lg"
                                            variant={loading ? "shadow" : "flat"}
                                            color={loading ? "danger" : "default"}
                                            className={cn(
                                                "transition-all duration-300",
                                                !loading && "bg-zinc-100 dark:bg-white/5 hover:bg-amber-500 hover:text-white"
                                            )}
                                            onClick={handleSyncData(item)}
                                        >
                                            {loading ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                                        </Button>
                                    </Tooltip>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-amber-500" : "bg-emerald-500")} />
                                            {loading ? t('sync_tab.status.syncing') : t('sync_tab.status.ready')}
                                        </div>
                                        <span>{t('sync_tab.status.type_label')}: {item.kind}</span>
                                    </div>
                                    <Progress 
                                        size="sm"
                                        radius="full"
                                        isIndeterminate={loading}
                                        value={loading ? undefined : 0}
                                        color={loading ? "warning" : "default"}
                                        className="h-1.5 opacity-50"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                                            <Clock size={12} />
                                            TMDB API v3
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                                            <AlertCircle size={12} />
                                            {t('sync_tab.status.priority')}
                                        </div>
                                    </div>
                                    <Badge 
                                        color={loading ? "warning" : "success"} 
                                        variant="flat" 
                                        className="font-black text-[9px] uppercase px-2"
                                    >
                                        {loading ? t('sync_tab.status.in_progress') : t('sync_tab.status.available')}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

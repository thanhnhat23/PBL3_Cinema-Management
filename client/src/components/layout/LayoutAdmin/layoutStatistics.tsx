import { ChartNoAxesCombined } from "lucide-react"
import { useTranslation } from "react-i18next";

export default function LayoutStatistics() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <ChartNoAxesCombined size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        Management System
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('dashboard.statistics_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('dashboard.statistics_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>


        </div>
    )
}

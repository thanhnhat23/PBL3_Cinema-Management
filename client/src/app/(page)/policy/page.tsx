'use client'

import { ShieldCheck, Eye, Lock, Share2, UserCheck, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
    const { t } = useTranslation();
    const sections = [
        {
            icon: <ShieldCheck className="text-amber-500" size={24} />,
            title: t('policy.sections.s1_title'),
            content: t('policy.sections.s1_content')
        },
        {
            icon: <Eye className="text-amber-500" size={24} />,
            title: t('policy.sections.s2_title'),
            content: t('policy.sections.s2_content')
        },
        {
            icon: <Lock className="text-amber-500" size={24} />,
            title: t('policy.sections.s3_title'),
            content: t('policy.sections.s3_content')
        },
        {
            icon: <Share2 className="text-amber-500" size={24} />,
            title: t('policy.sections.s4_title'),
            content: t('policy.sections.s4_content')
        },
        {
            icon: <UserCheck className="text-amber-500" size={24} />,
            title: t('policy.sections.s5_title'),
            content: t('policy.sections.s5_content')
        },
        {
            icon: <Bell className="text-amber-500" size={24} />,
            title: t('policy.sections.s6_title'),
            content: t('policy.sections.s6_content')
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        {t('policy.privacy_safety')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-tight">
                        {t('policy.hero_title')} <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{t('policy.hero_subtitle')}</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                        {t('policy.hero_desc')}
                    </p>
                </div>

                {/* Content Sections */}
                <div className="grid gap-8 pt-8">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="group p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-500"
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    {section.icon}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-amber-500 transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Quote */}
                <div className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center italic text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                    &ldquo;{t('policy.footer_quote')}&rdquo;
                </div>
            </div>
        </div>
    );
}

'use client'

import { BookOpen, CreditCard, AlertCircle, Scale, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TermsOfUse() {
    const { t } = useTranslation();
    const sections = [
        {
            icon: <BookOpen className="text-amber-500" size={24} />,
            title: t('terms.sections.s1_title'),
            content: t('terms.sections.s1_content')
        },
        {
            icon: <CheckCircle2 className="text-amber-500" size={24} />,
            title: t('terms.sections.s2_title'),
            content: t('terms.sections.s2_content')
        },
        {
            icon: <CreditCard className="text-amber-500" size={24} />,
            title: t('terms.sections.s3_title'),
            content: t('terms.sections.s3_content')
        },
        {
            icon: <ShieldAlert className="text-amber-500" size={24} />,
            title: t('terms.sections.s4_title'),
            content: t('terms.sections.s4_content')
        },
        {
            icon: <AlertCircle className="text-amber-500" size={24} />,
            title: t('terms.sections.s5_title'),
            content: t('terms.sections.s5_content')
        },
        {
            icon: <Scale className="text-amber-500" size={24} />,
            title: t('terms.sections.s6_title'),
            content: t('terms.sections.s6_content')
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        {t('terms.usage_agreement')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-tight">
                        {t('terms.hero_title')} <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{t('terms.hero_subtitle')}</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                        {t('terms.hero_desc')}
                    </p>
                </div>

                {/* Content Cards */}
                <div className="grid gap-6 pt-8">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="relative group p-8 bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-sm overflow-hidden hover:border-amber-500/50 transition-all duration-300"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 -rotate-45 translate-x-8 -translate-y-8 group-hover:bg-amber-500/10 transition-colors" />
                            
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                <div className="shrink-0 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl h-fit border border-zinc-100 dark:border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    {section.icon}
                                </div>
                                <div className="space-y-3 text-left">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {section.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Disclaimer */}
                <div className="mt-16 p-8 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-sm text-center space-y-4">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                        {t('terms.footer_disclaimer')}
                    </p>
                    <div className="text-amber-500 font-black text-xs tracking-widest uppercase italic">
                        {t('common.copyright')}
                    </div>
                </div>
            </div>
        </div>
    );
}

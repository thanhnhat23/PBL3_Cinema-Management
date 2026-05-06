'use client'

import { Accordion, AccordionItem } from "@heroui/react";
import { Ticket, User, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FAQ() {
    const { t } = useTranslation();
    const faqData = [
        {
            category: t('faq.categories.c1_title'),
            icon: <User className="text-amber-500" size={20} />,
            questions: [
                {
                    q: t('faq.questions.q1_q'),
                    a: t('faq.questions.q1_a')
                },
                {
                    q: t('faq.questions.q2_q'),
                    a: t('faq.questions.q2_a')
                },
                {
                    q: t('faq.questions.q3_q'),
                    a: t('faq.questions.q3_a')
                }
            ]
        },
        {
            category: t('faq.categories.c2_title'),
            icon: <Ticket className="text-amber-500" size={20} />,
            questions: [
                {
                    q: t('faq.questions.q4_q'),
                    a: t('faq.questions.q4_a')
                },
                {
                    q: t('faq.questions.q5_q'),
                    a: t('faq.questions.q5_a')
                },
                {
                    q: t('faq.questions.q6_q'),
                    a: t('faq.questions.q6_a')
                }
            ]
        },
        {
            category: t('faq.categories.c3_title'),
            icon: <Gift className="text-amber-500" size={20} />,
            questions: [
                {
                    q: t('faq.questions.q7_q'),
                    a: t('faq.questions.q7_a')
                },
                {
                    q: t('faq.questions.q8_q'),
                    a: t('faq.questions.q8_a')
                },
                {
                    q: t('faq.questions.q9_q'),
                    a: t('faq.questions.q9_a')
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        {t('faq.support_center')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-tight">
                        {t('faq.hero_title')} <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{t('faq.hero_subtitle')}</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
                        {t('faq.hero_desc')}
                    </p>
                </div>

                {/* FAQ Groups */}
                <div className="space-y-10 pt-8">
                    {faqData.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-6">
                            <div className="flex items-center gap-3 px-4 py-2 border-l-4 border-amber-500 bg-amber-500/5">
                                {group.icon}
                                <h2 className="text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                                    {group.category}
                                </h2>
                            </div>

                            <Accordion 
                                variant="splitted"
                                className="px-0"
                                itemClasses={{
                                    base: "bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-sm mb-4 last:mb-0 shadow-sm",
                                    title: "text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-200",
                                    content: "text-zinc-500 dark:text-zinc-400 text-sm md:text-base pb-6 font-medium leading-relaxed",
                                    indicator: "text-amber-500"
                                }}
                            >
                                {group.questions.map((item, itemIndex) => (
                                    <AccordionItem 
                                        key={itemIndex} 
                                        aria-label={item.q} 
                                        title={item.q}
                                    >
                                        {item.a}
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                {/* Contact Support CTA */}
                <div className="mt-20 p-10 bg-zinc-900 dark:bg-white rounded-sm text-white dark:text-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-black uppercase italic">{t('faq.cta_title')}</h3>
                        <p className="text-zinc-400 dark:text-zinc-500 font-medium">{t('faq.cta_desc')}</p>
                    </div>
                    <a 
                        href="mailto:luongthanhnhat567@gmail.com" 
                        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-sm rounded-lg transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(245,158,11,0.3)]"
                    >
                        {t('faq.cta_button')}
                    </a>
                </div>
            </div>
        </div>
    );
}

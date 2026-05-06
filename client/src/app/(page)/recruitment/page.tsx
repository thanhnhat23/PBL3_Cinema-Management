'use client'

import { Briefcase, Users, Star, GraduationCap, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Recruitment() {
    const { t } = useTranslation();
    const jobs = [
        {
            title: t('recruitment.jobs.j1_title'),
            location: t('recruitment.jobs.locations.nationwide'),
            type: t('recruitment.jobs.types.full_time'),
            salary: t('recruitment.jobs.j1_salary'),
            desc: t('recruitment.jobs.j1_desc')
        },
        {
            title: t('recruitment.jobs.j2_title'),
            location: t('recruitment.jobs.locations.cities'),
            type: t('recruitment.jobs.types.part_time'),
            salary: t('recruitment.jobs.j2_salary'),
            desc: t('recruitment.jobs.j2_desc')
        },
        {
            title: t('recruitment.jobs.j3_title'),
            location: t('recruitment.jobs.locations.cities_extended'),
            type: t('recruitment.jobs.types.full_time'),
            salary: t('recruitment.jobs.j3_salary'),
            desc: t('recruitment.jobs.j3_desc')
        }
    ];

    const benefits = [
        { icon: <Star />, text: t('recruitment.benefits.free_movies') },
        { icon: <Users />, text: t('recruitment.benefits.environment') },
        { icon: <GraduationCap />, text: t('recruitment.benefits.training') },
        { icon: <Clock />, text: t('recruitment.benefits.flex_time') }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-6xl mx-auto space-y-20">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        {t('recruitment.join_our_team')}
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">
                        {t('recruitment.hero_title')} <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{t('recruitment.hero_subtitle')}</span> MILKYWAYYY
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto text-lg">
                        {t('recruitment.hero_desc')}
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {benefits.map((benefit, i) => (
                        <div key={i} className="p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm text-center space-y-4 hover:border-amber-500/50 transition-all duration-300 shadow-sm group">
                            <div className="inline-flex p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                                {benefit.icon}
                            </div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-tighter italic leading-tight">
                                {benefit.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Job Listings */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                        <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-900 dark:text-white italic">{t('recruitment.jobs_title')}</h2>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                    </div>

                    <div className="grid gap-6">
                        {jobs.map((job, i) => (
                            <div key={i} className="group p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm hover:shadow-2xl hover:border-amber-500/30 transition-all duration-500">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-3">
                                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                                                <MapPin size={12} /> {job.location}
                                            </span>
                                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                                                <Briefcase size={12} /> {job.type}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                            {job.title}
                                        </h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl italic leading-relaxed">
                                            &quot;{job.desc}&quot;
                                        </p>
                                        <p className="text-amber-600 font-black text-sm uppercase tracking-widest">
                                            {t('recruitment.salary_label')} {job.salary}
                                        </p>
                                    </div>
                                        <Button 
                                            as={Link}
                                            href="/recruitment/apply"
                                            className="w-full md:w-auto px-6 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest text-xs group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xl"
                                            endContent={<ArrowRight size={16} />}
                                        >
                                            {t('recruitment.apply_button')}
                                        </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="p-12 bg-linear-to-r from-amber-500 to-orange-600 rounded-sm text-center space-y-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">{t('recruitment.cta_title')}</h2>
                        <p className="font-medium text-amber-100 max-w-2xl mx-auto">
                            {t('recruitment.cta_desc')}
                        </p>
                        <div className="pt-4">
                            <a href="mailto:hr@milkywayyy.com" className="px-10 py-4 bg-white text-amber-600 font-black uppercase tracking-widest text-sm rounded-lg hover:bg-zinc-900 hover:text-white transition-all inline-block shadow-lg">
                                {t('recruitment.cta_button')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

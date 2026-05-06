'use client'

import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { FaFacebook, FaAt, FaInstagram } from "react-icons/fa";
import { Button, Input, Textarea } from "@heroui/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function Contact() {
    const { t } = useTranslation();
    const contactInfo = [
        {
            icon: <MapPin className="text-amber-500" size={24} />,
            title: t('contact.info.address_title'),
            detail: t('contact.info.address_detail'),
            desc: t('contact.info.address_desc')
        },
        {
            icon: <Phone className="text-amber-500" size={24} />,
            title: t('contact.info.hotline_title'),
            detail: "1900 2310",
            desc: t('contact.info.hotline_desc')
        },
        {
            icon: <Mail className="text-amber-500" size={24} />,
            title: t('contact.info.email_title'),
            detail: "milkywayyy@cinema.me",
            desc: t('contact.info.email_desc')
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
            <div className="max-w-7xl mx-auto space-y-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-zinc-200 dark:border-white/10 pb-12">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            {t('contact.contact_us')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">
                            {t('contact.hero_title')} <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{t('contact.hero_subtitle')}</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg italic">
                            {t('contact.hero_desc')}
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        {[
                            { icon: <FaFacebook />, href: "https://www.facebook.com/nekonora.23/", bgHover: "hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30", iconHover: "group-hover:!text-[#1877F2]" },
                            { icon: <FaAt />, href: "mailto:luongthanhnhat567@gmail.com", bgHover: "hover:bg-red-500/10 hover:border-red-500/30", iconHover: "group-hover:!text-red-500" },
                            { icon: <FaInstagram />, href: "https://www.instagram.com/milky.wayyy_06/", bgHover: "hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30", iconHover: "group-hover:!text-[#E4405F]" }
                        ].map((social, i) => (
                            <Link 
                                key={i} 
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "group w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm",
                                    social.bgHover
                                )}
                            >
                                <div className={cn(
                                    "text-zinc-600 dark:text-zinc-400 transition-colors duration-300 flex items-center justify-center",
                                    social.iconHover
                                )}>
                                    {social.icon}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="grid gap-6">
                            {contactInfo.map((info, i) => (
                                <div key={i} className="group p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm hover:border-amber-500/30 transition-all duration-300">
                                    <div className="flex gap-6">
                                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl h-fit border border-zinc-100 dark:border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                            {info.icon}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{info.title}</h3>
                                            <p className="text-xl font-bold text-zinc-900 dark:text-white">{info.detail}</p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium italic">{info.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Working Hours Card */}
                        <div className="p-8 bg-zinc-900 text-white rounded-sm space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] group-hover:bg-amber-500/20 transition-colors" />
                            <div className="flex items-center gap-3">
                                <Clock className="text-amber-500" />
                                <h3 className="text-xl font-black uppercase italic tracking-wider">{t('contact.working_hours.title')}</h3>
                            </div>
                            <div className="space-y-4 font-medium text-zinc-400">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>{t('contact.working_hours.weekdays')}</span>
                                    <span className="text-white">08:00 - 23:00</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>{t('contact.working_hours.weekends')}</span>
                                    <span className="text-white">07:30 - 00:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('contact.working_hours.holidays')}</span>
                                    <span className="text-amber-500">{t('contact.working_hours.open_all_night')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm p-8 md:p-12 shadow-2xl relative">
                             <div className="absolute top-8 right-8">
                                <MessageSquare size={40} className="text-zinc-100 dark:text-white/5 rotate-12" />
                             </div>
                             
                             <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black uppercase italic text-zinc-900 dark:text-white tracking-tighter">{t('contact.form.title')}</h2>
                                    <p className="text-zinc-500 font-medium">{t('contact.form.subtitle')}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input 
                                        label={t('contact.form.name_label')} 
                                        placeholder={t('contact.form.name_placeholder')}
                                        labelPlacement="outside"
                                        variant="bordered"
                                        classNames={{ inputWrapper: "h-14 rounded-sm" }}
                                    />
                                    <Input 
                                        label={t('contact.form.email_label')} 
                                        placeholder="example@gmail.com"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        classNames={{ inputWrapper: "h-14 rounded-sm" }}
                                    />
                                </div>

                                <Input 
                                    label={t('contact.form.subject_label')} 
                                    placeholder={t('contact.form.subject_placeholder')}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    classNames={{ inputWrapper: "h-14 rounded-sm" }}
                                />

                                <Textarea 
                                    label={t('contact.form.message_label')} 
                                    placeholder={t('contact.form.message_placeholder')}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    minRows={6}
                                    classNames={{ inputWrapper: "rounded-sm p-4" }}
                                />

                                <Button 
                                    className="w-full h-16 bg-linear-to-r from-amber-500 to-orange-600 text-white font-black uppercase tracking-[0.2em] text-sm rounded-sm shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1 transition-all"
                                    endContent={<Send size={18} />}
                                >
                                    {t('contact.form.send_button')}
                                </Button>
                             </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

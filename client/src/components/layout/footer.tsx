'use client';

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaGithub, FaAt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export default function FooterLayout() {
  const { t } = useTranslation();
  return (
    <footer className="relative bg-sidebar pt-24 pb-12 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-150 h-48 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Identity */}
                <div className="flex flex-col gap-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">MilkyWayyy</span>
                            <span className="text-[10px] font-bold tracking-[0.4em] text-amber-500 uppercase">{t('navbar.cinema_experience')}</span>
                        </div>
                    </Link>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-medium">
                        {t('footer.description')}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        {[
                            { icon: <FaFacebookF />, href: "https://www.facebook.com/nekonora.23/", bgHover: "hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30", iconHover: "group-hover:!text-[#1877F2]" },
                            { icon: <FaAt />, href: "mailto: luongthanhnhat567@gmail.com", bgHover: "hover:bg-red-500/10 hover:border-red-500/30", iconHover: "group-hover:!text-red-500" },
                            { icon: <FaGithub />, href: "https://github.com/thanhnhat23", bgHover: "hover:bg-zinc-900/10 dark:hover:bg-white/10 hover:border-zinc-900/30 dark:hover:border-white/30", iconHover: "group-hover:!text-zinc-900 dark:group-hover:!text-white" },
                            { icon: <FaInstagram />, href: "https://www.instagram.com/milky.wayyy_06/", bgHover: "hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30", iconHover: "group-hover:!text-[#E4405F]" }
                        ].map((social, i) => (
                            <Link 
                                key={i} 
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "group w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm",
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

                {/* Quick Links: Cinema */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                        {t('footer.cinema_title')}
                    </h3>
                    <nav className="flex flex-col gap-3">
                        {[
                            { label: t('navbar.movies_now'), href: "/movies?tab=nowplaying" },
                            { label: t('navbar.movies_upcoming'), href: "/movies?tab=coming-soon" },
                            { label: t('navbar.movies_hot'), href: "/movies?tab=popular" },
                            { label: t('navbar.categories'), href: "/category" },
                            { label: t('navbar.reviews'), href: "/reviews" }
                        ].map((link, i) => (
                            <Link 
                                key={i} 
                                href={link.href}
                                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm font-bold transition-colors w-fit"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Quick Links: Support */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                        {t('footer.support_title')}
                    </h3>
                    <nav className="flex flex-col gap-3">
                        {[
                            { label: t('navbar.cinemas_system'), href: "/cinemas" },
                            { label: t('footer.links.promotions'), href: "/promotions" },
                            { label: t('footer.links.recruitment'), href: "/recruitment" },
                            { label: t('footer.links.contact'), href: "/contact" },
                            { label: t('footer.links.faq'), href: "/faq" },
                            { label: t('footer.links.policy'), href: "/policy" },
                            { label: t('footer.links.terms'), href: "/terms" }
                        ].map((link, i) => (
                            <Link 
                                key={i} 
                                href={link.href}
                                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm font-bold transition-colors w-fit"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Newsletter / Contact */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                        {t('footer.newsletter_title')}
                    </h3>
                    <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                        {t('footer.newsletter_desc')}
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="relative group">
                            <input 
                                type="email" 
                                placeholder={t('footer.email_placeholder')}
                                className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-sm py-3 px-4 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500/50 transition-all"
                            />
                            <button className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-amber-400 transition-colors">
                                {t('footer.send_button')}
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-600 italic">
                            {t('footer.privacy_note')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-12 border-t border-zinc-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <p className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.4em]">MilkyWayyy Cinema Ltd.</p>
                    <p className="text-zinc-600 text-[10px] font-medium uppercase tracking-widest">
                        © 2026 MILKYWAYYY CINEMA EXPERIENCE. ALL RIGHTS RESERVED.
                    </p>
                </div>
                
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Powered by</span>
                        <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Next.js & HeroUI</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-200 dark:bg-white/10" />
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Region</span>
                        <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest italic">VIETNAM - GLOBAL</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
}
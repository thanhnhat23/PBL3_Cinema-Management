"use client"

import { Button, Input, Textarea, Select, SelectItem, Checkbox } from "@heroui/react";
import { User, Mail, Phone, FileText, Upload, Send, ArrowLeft, CheckCircle2, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ApplyPage() {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#050505] px-6">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-12 rounded-sm shadow-2xl text-center space-y-6">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">{t('recruitment.apply.success_title')}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                        {t('recruitment.apply.success_desc')}
                    </p>
                    <Button 
                        as={Link}
                        href="/recruitment"
                        className="w-full h-14 bg-amber-500 text-white font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(245,158,11,0.3)] rounded-sm"
                    >
                        {t('recruitment.apply.back_to_jobs')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/recruitment" 
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors mb-10 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">{t('recruitment.apply.back')}</span>
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Info Side */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                                {t('recruitment.apply.hero_start')} <br /> <span className="text-amber-500">{t('recruitment.apply.hero_journey')}</span>
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                                {t('recruitment.apply.hero_desc')}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm">
                                <div className="flex gap-4 items-start">
                                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{t('recruitment.apply.info.desired_position')}</p>
                                         <p className="font-bold text-sm">{t('recruitment.apply.info.multi_role')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-sm">
                                <div className="flex gap-4 items-start">
                                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{t('recruitment.apply.info.location')}</p>
                                         <p className="font-bold text-sm">{t('recruitment.apply.info.all_cinemas')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-8 md:p-12 rounded-sm shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                 label={t('recruitment.apply.form.name_label')}
                                 placeholder={t('recruitment.apply.form.name_placeholder')}
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                size="lg"
                                startContent={<User className="text-zinc-400" size={18} />}
                                classNames={{
                                    label: "text-[10px] font-black uppercase tracking-widest text-zinc-400",
                                    inputWrapper: "border-zinc-200 dark:border-white/10 focus-within:!border-amber-500"
                                }}
                            />
                             <Input
                                 label={t('recruitment.apply.form.email_label')}
                                placeholder="example@mail.com"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                size="lg"
                                type="email"
                                startContent={<Mail className="text-zinc-400" size={18} />}
                                classNames={{
                                    label: "text-[10px] font-black uppercase tracking-widest text-zinc-400",
                                    inputWrapper: "border-zinc-200 dark:border-white/10 focus-within:!border-amber-500"
                                }}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                 label={t('recruitment.apply.form.phone_label')}
                                 placeholder="090x xxx xxx"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                size="lg"
                                startContent={<Phone className="text-zinc-400" size={18} />}
                                classNames={{
                                    label: "text-[10px] font-black uppercase tracking-widest text-zinc-400",
                                    inputWrapper: "border-zinc-200 dark:border-white/10 focus-within:!border-amber-500"
                                }}
                            />
                            <Select
                                 label={t('recruitment.apply.form.position_label')}
                                 placeholder={t('recruitment.apply.form.position_placeholder')}
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                size="lg"
                                classNames={{
                                    label: "text-[10px] font-black uppercase tracking-widest text-zinc-400",
                                    trigger: "border-zinc-200 dark:border-white/10 focus-within:!border-amber-500"
                                }}
                            >
                                 <SelectItem key="floor">{t('recruitment.jobs.j1_title')}</SelectItem>
                                 <SelectItem key="staff">{t('recruitment.jobs.j2_title')}</SelectItem>
                                 <SelectItem key="tech">{t('recruitment.jobs.j3_title')}</SelectItem>
                                 <SelectItem key="mkt">{t('recruitment.apply.form.position_mkt', { defaultValue: 'Nhân viên Marketing' })}</SelectItem>
                            </Select>
                        </div>

                         <Textarea
                             label={t('recruitment.apply.form.intro_label')}
                             placeholder={t('recruitment.apply.form.intro_placeholder')}
                            labelPlacement="outside"
                            variant="bordered"
                            radius="sm"
                            minRows={4}
                            classNames={{
                                label: "text-[10px] font-black uppercase tracking-widest text-zinc-400",
                                inputWrapper: "border-zinc-200 dark:border-white/10 focus-within:!border-amber-500"
                            }}
                        />

                        <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('recruitment.apply.form.attach_cv')}</p>
                            <div className="border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-sm p-8 text-center group hover:border-amber-500/50 transition-colors cursor-pointer bg-zinc-50 dark:bg-white/5">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Upload size={20} className="text-amber-500" />
                                    </div>
                                     <div>
                                         <p className="text-sm font-bold" dangerouslySetInnerHTML={{ __html: t('recruitment.apply.form.upload_desc') }} />
                                         <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">{t('recruitment.apply.form.max_size')}</p>
                                     </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Checkbox 
                                radius="sm"
                                classNames={{
                                    label: "text-xs text-zinc-500 font-medium"
                                }}
                             >
                                 {t('recruitment.apply.form.declaration')}
                             </Checkbox>
                        </div>

                         <Button 
                             type="submit"
                             className="w-full h-16 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] transition-all rounded-sm"
                             endContent={<Send size={18} />}
                         >
                             {t('recruitment.apply.form.submit_button')}
                         </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

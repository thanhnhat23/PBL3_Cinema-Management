"use client";

import { useState } from "react";
import { Smartphone, Info, Copy, ExternalLink, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Button } from "@heroui/react";
import type { PaymentMethod } from "@/types/payment";
import type { Coupon } from "@/stores/useCouponStore";
import Image from "next/image";

interface SelectPaymentTabProps {
    selectedMethod: PaymentMethod | "";
    onSelectMethod: (method: PaymentMethod) => void;
    activeCoupon: Coupon | null;
    subtotal: number;
    orderCode?: string;
    paymentUrl?: string;
    onBack?: () => void;
}

export function SelectPaymentTab({
    selectedMethod,
    activeCoupon,
    subtotal,
    orderCode,
    paymentUrl,
    onBack
}: SelectPaymentTabProps) {
    const { t } = useTranslation();

    const TEST_CARDS = [
        // VNPAY - NCB Cards
        { 
            provider: "VNPAY",
            category: "atm",
            type: t('payment_tab.card_types.atm'),
            bank: "NCB", 
            no: "9704198526191432198", 
            holder: "NGUYEN VAN A", 
            date: "07/15", 
            otp: "123456", 
            status: t('payment_tab.status.success'),
            statusKey: "success"
        },
        { 
            provider: "VNPAY",
            category: "atm",
            type: t('payment_tab.card_types.atm'), 
            bank: "NCB", 
            no: "9704195798459170488", 
            holder: "NGUYEN VAN A", 
            date: "07/15", 
            status: t('payment_tab.status.insufficient_balance'),
            statusKey: "error"
        },
        { 
            provider: "VNPAY",
            category: "atm",
            type: t('payment_tab.card_types.atm'), 
            bank: "NCB", 
            no: "9704192181368742", 
            holder: "NGUYEN VAN A", 
            date: "07/15", 
            status: t('payment_tab.status.not_activated'),
            statusKey: "error"
        },
        { 
            provider: "VNPAY",
            category: "atm",
            type: t('payment_tab.card_types.atm'), 
            bank: "NCB", 
            no: "9704193370791314", 
            holder: "NGUYEN VAN A", 
            date: "07/15", 
            status: t('payment_tab.status.blocked'),
            statusKey: "error"
        },
        { 
            provider: "VNPAY",
            category: "atm",
            type: t('payment_tab.card_types.atm'), 
            bank: "NCB", 
            no: "9704194841945513", 
            holder: "NGUYEN VAN A", 
            date: "07/15", 
            status: t('payment_tab.status.expired'),
            statusKey: "error"
        },

        // VNPAY - International Cards
        { 
            provider: "VNPAY",
            category: "international",
            type: t('payment_tab.card_types.visa'), 
            bank: "VISA (No 3DS)", 
            no: "4456530000001005", 
            holder: "NGUYEN VAN A", 
            date: "12/26", 
            cvc: "123", 
            status: t('payment_tab.status.success'),
            statusKey: "success"
        },
        { 
            provider: "VNPAY",
            category: "international",
            type: t('payment_tab.card_types.visa'), 
            bank: "VISA (3DS)", 
            no: "4456530000001096", 
            holder: "NGUYEN VAN A", 
            date: "12/26", 
            cvc: "123", 
            status: t('payment_tab.status.success'),
            statusKey: "success"
        },

        // MOMO - ATM Cards
        {
            provider: "MOMO",
            category: "atm",
            type: t('payment_tab.card_types.atm'),
            bank: "MOMO ATM",
            no: "9704 0000 0000 0018",
            holder: "NGUYEN VAN A",
            date: "03/07",
            otp: "OTP",
            status: t('payment_tab.status.success'),
            statusKey: "success"
        },
        {
            provider: "MOMO",
            category: "atm",
            type: t('payment_tab.card_types.atm'),
            bank: "MOMO ATM",
            no: "9704 0000 0000 0026",
            holder: "NGUYEN VAN A",
            date: "03/07",
            otp: "OTP",
            status: t('payment_tab.status.blocked'),
            statusKey: "error"
        },
        {
            provider: "MOMO",
            category: "atm",
            type: t('payment_tab.card_types.atm'),
            bank: "MOMO ATM",
            no: "9704 0000 0000 0034",
            holder: "NGUYEN VAN A",
            date: "03/07",
            otp: "OTP",
            status: t('payment_tab.status.insufficient_balance'),
            statusKey: "error"
        },
        {
            provider: "MOMO",
            category: "atm",
            type: t('payment_tab.card_types.atm'),
            bank: "MOMO ATM",
            no: "9704 0000 0000 0042",
            holder: "NGUYEN VAN A",
            date: "03/07",
            otp: "OTP",
            status: t('payment_tab.status.limit_exceeded'),
            statusKey: "error"
        },

        // MOMO - International Cards
        {
            provider: "MOMO",
            category: "international",
            type: t('payment_tab.card_types.mastercard'),
            bank: "MasterCard (3DS)",
            no: "5200 0000 0000 1096",
            holder: "NGUYEN VAN A",
            date: "05/26",
            cvc: "111",
            otp: "OTP",
            status: t('payment_tab.status.success'),
            statusKey: "success"
        },
        {
            provider: "MOMO",
            category: "international",
            type: t('payment_tab.card_types.mastercard'),
            bank: "MasterCard",
            no: "5200 0000 0000 1104",
            holder: "NGUYEN VAN A",
            date: "05/26",
            cvc: "111",
            otp: "OTP",
            status: t('payment_tab.status.failed'),
            statusKey: "error"
        },
        {
            provider: "MOMO",
            category: "international",
            type: t('payment_tab.card_types.visa'),
            bank: "VISA (No OTP)",
            no: "4111 1111 1111 1111",
            holder: "NGUYEN VAN A",
            date: "05/26",
            cvc: "111",
            otp: "No OTP",
            status: t('payment_tab.status.success'),
            statusKey: "success"
        },
    ];

    const [showTestCards, setShowTestCards] = useState(false);

    const getStatusColor = (statusKey: string) => {
        switch (statusKey) {
            case "success": return "text-green-500";
            case "error": return "text-rose-500";
            default: return "text-zinc-500";
        }
    };

    const getStatusBg = (statusKey: string) => {
        switch (statusKey) {
            case "success": return "bg-green-500/10 border-green-500/20";
            case "error": return "bg-rose-500/10 border-rose-500/20";
            default: return "bg-zinc-500/10 border-zinc-500/20";
        }
    };

    const discount = activeCoupon 
        ? (activeCoupon.type === 0 
            ? Math.min((subtotal * activeCoupon.discountValue) / 100, activeCoupon.maxDiscountAmount || Infinity)
            : activeCoupon.discountValue)
        : 0;
    
    const finalTotal = Math.max(0, subtotal - discount);

    const qrUrl = paymentUrl 
        ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentUrl)}`
        : null;

    const isMomo = selectedMethod === 'MOMO' || selectedMethod === 'MOMO_ATM';
    const isMomoAtm = selectedMethod === 'MOMO_ATM';
    const providerLogo = isMomo 
        ? "https://cdn.brandfetch.io/idn4xaCzTm/w/180/h/180/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1734358540621"
        : "https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1774443408731";
    
    const providerName = isMomo ? (isMomoAtm ? "MOMO ATM" : "MOMO WALLET") : "VNPAY";

    const filteredCards = TEST_CARDS.filter(c => c.provider === (isMomo ? "MOMO" : "VNPAY"));

    const groupedCards = {
        atm: filteredCards.filter(c => c.category === "atm"),
        international: filteredCards.filter(c => c.category === "international")
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Order Info */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-sidebar border-zinc-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                            <h3 className="font-black text-sm uppercase italic tracking-tighter">{t('payment_tab.order_info_title')}</h3>
                            <Image 
                                src={providerLogo} 
                                alt={providerName} 
                                className="h-4 object-contain" 
                                width={16}
                                height={16}
                                unoptimized
                            />
                        </div>
                        <CardBody className="p-6 space-y-8">
                            <div className="space-y-1">
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{t('payment_tab.amount_to_pay')}</p>
                                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                                    {finalTotal.toLocaleString()} <span className="text-sm font-medium uppercase">VND</span>
                                </p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-white/5">
                                <div className="flex justify-between items-center text-green-500">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('payment_tab.discount')}</span>
                                    <span className="text-xs font-black">-{discount.toLocaleString()} VND</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{t('payment_tab.order_code')}</span>
                                    <span className="text-xs font-black">#{orderCode || "PENDING"}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Test Cards Information */}
                    <Card className="bg-sidebar border-zinc-200 dark:border-zinc-900 rounded-sm shadow-sm">
                        <CardBody className="p-4 space-y-4">
                            <div className="flex items-center gap-2 text-blue-600">
                                <Info size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {isMomo ? t('payment_tab.test_cards_modal_title_momo') : t('payment_tab.test_cards_modal_title')}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {filteredCards.slice(0, 1).map((card, idx) => (
                                    <div key={idx} className="text-[10px] space-y-1">
                                        <p className="font-bold text-zinc-500 italic uppercase tracking-tighter opacity-70">
                                            {isMomo ? t('payment_tab.test_labels.momo') : t('payment_tab.test_labels.vnpay')}
                                        </p>
                                        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 border border-blue-100 dark:border-blue-900/20 rounded-sm">
                                            <code className="font-black tabular-nums">{card.no}</code>
                                            <Button size="sm" isIconOnly variant="light" className="h-6 w-6 min-w-0" onClick={() => navigator.clipboard.writeText(card.no)}>
                                                <Copy size={10} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button 
                                size="sm" 
                                variant="bordered" 
                                color="primary" 
                                className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-2 border-blue-500/30 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/10"
                                onPress={() => setShowTestCards(true)}
                            >
                                {t('payment_tab.view_all_test_cards')}
                            </Button>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Methods & Payment Content */}
                <div className="lg:col-span-8">
                    <Card className="bg-sidebar border-zinc-200 dark:border-white/10 rounded-sm shadow-xl overflow-hidden min-h-125">
                        <CardBody className="p-0">
                            {paymentUrl ? (
                                <div className="p-10 flex flex-col items-center justify-center space-y-10 animate-in slide-in-from-right-10 duration-500">
                                    <div className="text-center space-y-3">
                                        <h2 className="text-lg font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">
                                            {isMomo 
                                                ? (isMomoAtm ? t('payment_tab.momo_atm_qr_instruction') : t('payment_tab.qr_momo_instruction'))
                                                : t('payment_tab.qr_instruction')}
                                        </h2>
                                        <div className="flex items-center justify-center gap-2 text-blue-500">
                                            <Smartphone size={16} className={isMomo ? "text-pink-500" : "text-blue-500"} />
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", isMomo ? "text-pink-500" : "text-blue-500")}>
                                                {isMomoAtm ? t('payment_tab.momo_atm_guide') : (isMomo ? t('payment_tab.momo_guide') : t('payment_tab.payment_guide'))}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative p-6 bg-white border-2 border-zinc-100 rounded-sm shadow-lg group">
                                        {qrUrl && (
                                            <Image
                                                src={qrUrl}
                                                alt="VNPAY QR"
                                                width={224}
                                                height={224}
                                                className="w-56 h-56 object-contain"
                                            />
                                        )}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-zinc-100">
                                            <Image
                                                src={providerLogo}
                                                alt={providerName}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-4 w-full max-w-xs pt-4">
                                        <Button 
                                            color={isMomo ? "danger" : "primary"}
                                            variant="shadow"
                                            className={cn(
                                                "w-full h-14 font-black uppercase italic tracking-tighter rounded-sm shadow-xl",
                                                isMomo ? "bg-[#A50064] shadow-pink-500/20" : "shadow-amber-500/20"
                                            )}
                                            startContent={<ExternalLink size={20} />}
                                            onClick={() => paymentUrl && window.open(paymentUrl, '_blank')}
                                        >
                                            {isMomo ? t('payment_tab.momo_redirect_button') : t('payment_tab.redirect_button')}
                                        </Button>

                                        <p className="text-[10px] text-zinc-500 italic text-center px-4 leading-relaxed">
                                            {isMomoAtm 
                                                ? t('payment_tab.momo_atm_footer_instruction')
                                                : (isMomo ? t('payment_tab.momo_footer_instruction') : t('payment_tab.footer_instruction'))}
                                        </p>
                                    </div>
                                    
                                    <Button 
                                        variant="light" 
                                        size="sm" 
                                        onClick={onBack}
                                        className="text-[10px] font-bold uppercase text-zinc-400 border-1 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all shadow-sm shadow-zinc-500/10"
                                    >
                                        {t('common.change_method')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-20 flex flex-col items-center justify-center space-y-6 text-center">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                                        <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter">
                                            {t('payment_tab.initializing')}
                                        </h3>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-50">
                                            {t('payment_tab.initializing_desc')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Test Cards Modal */}
            {showTestCards && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 rounded-sm shadow-2xl">
                        <CardBody className="p-8 space-y-6">
                             <div className="flex justify-between items-center">
                                 <h3 className="text-xl font-black uppercase italic tracking-tighter">
                                     {isMomo ? t('payment_tab.test_cards_modal_title_momo') : t('payment_tab.test_cards_modal_title')}
                                 </h3>
                                 <Button size="sm" variant="light" isIconOnly onClick={() => setShowTestCards(false)} className="rounded-full">✕</Button>
                             </div>

                             {isMomo && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-sm space-y-2">
                                         <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-500 italic">ATM Test Details</h4>
                                         <ul className="text-[10px] space-y-1 text-zinc-500 font-medium">
                                             {(t('payment_tab.test_instructions.momo_atm', { returnObjects: true }) as string[]).map((step, i) => (
                                                 <li key={i}>{step}</li>
                                             ))}
                                         </ul>
                                     </div>
                                     <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-sm space-y-2">
                                         <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Credit Cards Test Details</h4>
                                         <ul className="text-[10px] space-y-1 text-zinc-500 font-medium">
                                             {(t('payment_tab.test_instructions.momo_intl', { returnObjects: true }) as string[]).map((step, i) => (
                                                 <li key={i}>{step}</li>
                                             ))}
                                         </ul>
                                     </div>
                                 </div>
                             )}
                            
                            <div className="space-y-8 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                                {/* ATM Category */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('payment_tab.card_types.atm')}</span>
                                        <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {groupedCards.atm.map((card, idx) => (
                                            <div key={idx} className={cn("p-4 border rounded-sm transition-all", getStatusBg(card.statusKey || ""))}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{card.bank}</span>
                                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", getStatusColor(card.statusKey || ""))}>{card.status}</span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                                    <div>
                                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">{t('payment_tab.card_labels.card_no')}</p>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-xs font-black tabular-nums">{card.no}</code>
                                                            <button onClick={() => navigator.clipboard.writeText(card.no)} className="text-zinc-400 hover:text-blue-500 transition-colors">
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">{t('payment_tab.card_labels.holder')}</p>
                                                        <p className="text-xs font-black uppercase">{card.holder}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">{t('payment_tab.card_labels.date')}</p>
                                                        <p className="text-xs font-black tabular-nums">{card.date}</p>
                                                    </div>
                                                    {card.otp && (
                                                        <div>
                                                            <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">OTP</p>
                                                            <p className="text-xs font-black tabular-nums text-amber-500">{card.otp}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* International Category */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('payment_tab.card_types.visa')} / MASTERCARD / JCB</span>
                                        <div className="h-px flex-1 bg-zinc-100 dark:bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {groupedCards.international.map((card, idx) => (
                                            <div key={idx} className={cn("p-4 border rounded-sm transition-all", getStatusBg(card.statusKey || ""))}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{card.bank}</span>
                                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", getStatusColor(card.statusKey || ""))}>{card.status}</span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                                    <div>
                                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">{t('payment_tab.card_labels.card_no')}</p>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-xs font-black tabular-nums">{card.no}</code>
                                                            <button onClick={() => navigator.clipboard.writeText(card.no)} className="text-zinc-400 hover:text-blue-500 transition-colors">
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">{t('payment_tab.card_labels.holder')}</p>
                                                        <p className="text-xs font-black uppercase">{card.holder}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">{t('payment_tab.card_labels.date')}</p>
                                                        <p className="text-xs font-black tabular-nums">{card.date}</p>
                                                    </div>
                                                    {card.cvc && (
                                                        <div>
                                                            <p className="text-[9px] text-zinc-400 uppercase font-black tracking-tighter mb-1">CVC/CVV</p>
                                                            <p className="text-xs font-black tabular-nums text-amber-500">{card.cvc}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-zinc-500 italic text-center">
                                {t('payment_tab.test_cards_note')}
                            </p>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}

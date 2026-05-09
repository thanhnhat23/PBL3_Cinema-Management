"use client";

import { Tag, CheckCircle2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Divider, Input, Button, Card, CardBody } from "@heroui/react";
import Image from "next/image";
import type { Snack } from "@/stores/useSnackStore";
import type { Coupon } from "@/stores/useCouponStore";
import type { PaymentMethod } from "@/types/payment";

interface ConfirmationTabProps {
    movieTitle: string;
    cinemaName: string;
    showtimeDate: string;
    showtimeTime: string;
    selectedSeats: string[];
    selectedSnacks: Record<number, number>;
    snacks: Snack[];
    subtotal: number;
    discountAmount: number;
    finalTotal: number;
    
    // Payment & Coupon props
    selectedMethod: PaymentMethod | "";
    onSelectMethod: (method: PaymentMethod) => void;
    couponCode: string;
    onCouponChange: (code: string) => void;
    onApplyCoupon: () => void;
    activeCoupon: Coupon | null;
    couponError: string;
    moviePoster?: string;
}

export function ConfirmationTab({
    subtotal,
    discountAmount,
    finalTotal,
    selectedMethod,
    onSelectMethod,
    couponCode,
    onCouponChange,
    onApplyCoupon,
    activeCoupon,
    couponError
}: ConfirmationTabProps) {
    const { t } = useTranslation();

    const paymentMethods = [
        { 
            id: "VNPAYQR" as PaymentMethod, 
            name: t('payment_tab.methods.vnpay'), 
            logo: "https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1774443408731",
            active: true
        },
        { 
            id: "MOMO" as PaymentMethod, 
            name: t('payment_tab.methods.momo_wallet'), 
            logo: "https://cdn.brandfetch.io/idn4xaCzTm/w/180/h/180/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1734358540621",
            active: true
        },
        { 
            id: "MOMO_ATM" as PaymentMethod, 
            name: t('payment_tab.methods.momo_atm'), 
            logo: "https://cdn.brandfetch.io/idn4xaCzTm/w/180/h/180/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1734358540621",
            active: true
        },
        { 
            id: "SEPAY" as PaymentMethod, 
            name: t('payment_tab.methods.sepay'), 
            logo: "https://cdn.brandfetch.io/idHAIffxOj/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1778093854359",
            active: false
        },
        { 
            id: "PAYPAL" as PaymentMethod, 
            name: t('payment_tab.methods.paypal'), 
            logo: "https://cdn.brandfetch.io/id-Wd4a4TS/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1727787926765",
            active: false
        },
    ];

    return (
        <div className="mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-sidebar border-white/5 rounded-sm shadow-2xl overflow-hidden relative group">
                {/* Decorative border at the top */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-500/20 via-amber-500 to-amber-500/20" />
                
                <CardBody className="p-10 space-y-10">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                            {t('booking.confirmation.title') || "XÁC NHẬN THANH TOÁN"}
                        </h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">
                            {t('booking.confirmation.subtitle') || "Vui lòng chọn mã giảm giá và phương thức thanh toán"}
                        </p>
                    </div>

                    {/* Coupon Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-amber-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">
                                {t('booking.confirmation.coupon_label') || "MÃ GIẢM GIÁ"}
                            </h4>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder={t('booking.confirmation.coupon_placeholder') || "Nhập mã khuyến mãi..."}
                                value={couponCode}
                                onValueChange={onCouponChange}
                                variant="bordered"
                                classNames={{
                                    inputWrapper: "rounded-sm border-zinc-200 dark:border-zinc-800 focus-within:border-amber-500 h-12 bg-sidebar",
                                    input: "text-sm font-bold"
                                }}
                            />
                            <Button 
                                className="dark:bg-white dark:text-black bg-zinc-900/95 text-white font-black uppercase text-[10px] rounded-sm px-6 h-12 shadow-lg"
                                onClick={onApplyCoupon}
                            >
                                {t('booking.confirmation.apply_button') || "ÁP DỤNG"}
                            </Button>
                        </div>
                        {couponError && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" /> {couponError}
                            </p>
                        )}
                        {activeCoupon && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
                                <CheckCircle2 size={12} /> {t('booking.confirmation.coupon_applied') || "MÃ ĐÃ ĐƯỢC ÁP DỤNG THÀNH CÔNG"}
                            </p>
                        )}
                    </div>

                    <Divider className="bg-white/5" />

                    {/* Payment Method Selection */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-amber-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">
                                {t('booking.confirmation.payment_method_label') || "PHƯƠNG THỨC THANH TOÁN"}
                            </h4>
                        </div>
                        <div className="flex flex-col gap-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    disabled={!method.active}
                                    onClick={() => onSelectMethod(method.id)}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-sm border transition-all text-left group relative overflow-hidden",
                                        !method.active ? "opacity-30 cursor-not-allowed dark:bg-zinc-800/50 bg-zinc-300 border-white/5" : 
                                        selectedMethod === method.id 
                                            ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20 shadow-xl" 
                                            : "border-white/5 bg-zinc-600/50 hover:border-white/20"
                                    )}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-sidebar rounded-sm border border-white/5 p-2 shrink-0">
                                        <Image 
                                            src={method.logo} 
                                            alt={method.name} 
                                            width={48}
                                            height={48}
                                            unoptimized
                                            className={cn("w-full h-full object-contain rounded-sm", !method.active && "grayscale")} 
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-sm md:text-lg uppercase tracking-tight">{method.name}</h4>
                                        {!method.active && (
                                            <span className="text-[8px] text-zinc-500 font-bold uppercase">
                                                {t('common.coming_soon') || "Sắp ra mắt"}
                                            </span>
                                        )}
                                    </div>
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                        selectedMethod === method.id ? "border-amber-500 bg-amber-500" : "border-white/10"
                                    )}>
                                        {selectedMethod === method.id && <CheckCircle2 size={12} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Divider className="bg-white/5" />

                    {/* Summary in Card */}
                    <div className="space-y-4 bg-zinc-300/50 dark:bg-zinc-800/50 p-6 rounded-sm border border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-zinc-500 uppercase tracking-widest">
                                {t('booking.confirmation.subtotal') || "TẠM TÍNH"}
                            </span>
                            <span className="tabular-nums">{subtotal.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-green-500 font-black">
                            <span className="uppercase tracking-widest">
                                {t('booking.confirmation.discount') || "GIẢM GIÁ"}
                            </span>
                            <span className="tabular-nums">-{discountAmount.toLocaleString()} VND</span>
                        </div>
                        <Divider className="bg-white/5" />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-black uppercase tracking-tighter italic">
                                {t('booking.confirmation.total_payable') || "TỔNG THANH TOÁN"}
                            </span>
                            <div className="text-right">
                                <div className="text-3xl font-black text-amber-500 tabular-nums italic leading-none">
                                    {finalTotal.toLocaleString()}
                                </div>
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">VND</span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

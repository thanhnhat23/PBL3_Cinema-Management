"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVnpayStore } from "@/stores/useVnpayStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    Calendar,
    Ticket,
    CreditCard,
    ShoppingBag,
    Home,
    Download
} from "lucide-react";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function VnpayReturnPage() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { verifyVnpayReturn } = useVnpayStore();
    const { authUser } = useAuthStore();
    const [status, setStatus] = useState<"loading" | "success" | "failed">(
        searchParams.get("vnp_SecureHash") ? "loading" : "failed"
    );

    useEffect(() => {
        const verify = async () => {
            const params: Record<string, string> = {};
            searchParams.forEach((value, key) => {
                params[key] = value;
            });

            const result = await verifyVnpayReturn(params);
            if (result && result.isSuccess && result.isValidSignature) {
                setStatus("success");
            } else {
                setStatus("failed");
            }
        };

        if (searchParams.get("vnp_SecureHash")) {
            verify();
        }
    }, [searchParams, verifyVnpayReturn]);

    if (status === "loading") {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" size={32} />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter animate-pulse">
                        {t('payment.verifying_transaction') || "Đang xác thực giao dịch..."}
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">
                        {t('payment.please_wait') || "Vui lòng chờ trong giây lát"}
                    </p>
                </div>
            </div>
        );
    }

    const isSuccess = status === "success";
    const amount = searchParams.get("vnp_Amount") ? parseInt(searchParams.get("vnp_Amount")!) / 100 : 0;
    const orderInfo = searchParams.get("vnp_OrderInfo") || "";
    const txnRef = searchParams.get("vnp_TxnRef") || "";
    const payDate = searchParams.get("vnp_PayDate") || "";

    // Format payDate (YYYYMMDDHHMMSS)
    const formattedDate = payDate.length === 14
        ? `${payDate.slice(6, 8)}/${payDate.slice(4, 6)}/${payDate.slice(0, 4)} ${payDate.slice(8, 10)}:${payDate.slice(10, 12)}`
        : "";

    return (
        <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-zinc-100 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-1000">
                <Card className={cn(
                    "border-none shadow-2xl overflow-hidden rounded-sm backdrop-blur-xl",
                    isSuccess ? "bg-white/80 dark:bg-zinc-900/80" : "bg-white/80 dark:bg-zinc-900/80"
                )}>
                    {/* Status Header */}
                    <div className={cn(
                        "h-2 w-full",
                        isSuccess ? "bg-linear-to-r from-blue-500 to-cyan-600" : "bg-linear-to-r from-red-400 to-rose-600"
                    )} />

                    <CardBody className="p-0">
                        <div className="p-10 flex flex-col items-center text-center space-y-6">
                            <div className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-500",
                                isSuccess ? "bg-[#005baa] text-white shadow-blue-500/20" : "bg-red-500 text-white shadow-red-500/20"
                            )}>
                                {isSuccess ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                            </div>

                            <div className="space-y-2">
                                <h1 className={cn(
                                    "text-4xl font-black uppercase italic tracking-tighter",
                                    isSuccess ? "text-[#005baa]" : "text-red-600 dark:text-red-400"
                                )}>
                                    {isSuccess ? t('payment.success_title') : t('payment.failed_title')}
                                </h1>
                                <p className="text-zinc-500 font-medium">
                                    {isSuccess
                                        ? t('payment.success_desc')
                                        : t('payment.failed_desc')}
                                </p>
                            </div>

                            {/* Transaction Details */}
                            <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-sm border border-zinc-100 dark:border-white/5 p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                        <ShoppingBag size={14} /> {t('payment.order_info')}
                                    </span>
                                    <span className="font-black text-zinc-900 dark:text-white uppercase italic">{orderInfo.replace(/\+/g, " ")}</span>
                                </div>
                                <Divider className="bg-zinc-200 dark:bg-white/5" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                        <CreditCard size={14} /> {t('payment.callback.amount')}
                                    </span>
                                    <span className="font-black text-[#005baa] dark:text-blue-400 tabular-nums text-lg">
                                        {amount.toLocaleString()} VND
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                        <Ticket size={14} /> {t('payment.callback.txn_ref')}
                                    </span>
                                    <span className="font-bold tabular-nums text-zinc-600 dark:text-zinc-300">{txnRef}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                        <Calendar size={14} /> {t('payment.callback.time')}
                                    </span>
                                    <span className="font-bold tabular-nums text-zinc-600 dark:text-zinc-300">{formattedDate}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
                                <Button 
                                    className={`w-full h-14 font-black uppercase italic tracking-tighter rounded-sm text-white shadow-xl ${isSuccess ? 'bg-[#005baa] shadow-blue-500/20' : 'bg-red-500 shadow-red-500/20'}`}
                                    onClick={() => router.push(`/profile/${authUser?.id || ''}?tab=history`)}
                                    startContent={isSuccess ? <Ticket size={20} /> : <ArrowRight size={20} />}
                                >
                                    {isSuccess ? t('payment.callback.view_tickets') : t('payment.callback.retry')}
                                </Button>
                                <Button 
                                    className="w-full h-14 font-black uppercase italic tracking-tighter rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl"
                                    onClick={() => router.push("/")}
                                    startContent={<Home size={20} />}
                                >
                                    {t('payment.callback.back_home')}
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Secure Note */}
                <p className="text-center mt-8 text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2 opacity-50">
                    <CheckCircle2 size={12} /> {t('payment.powered_by', { method: 'VNPAY' })}
                </p>
            </div>
        </div>
    );
}

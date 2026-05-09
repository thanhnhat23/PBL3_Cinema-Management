"use client";

import { Plus, Minus, Popcorn, Coffee, Gift, Utensils, CupSoda, Package } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Skeleton, Card, CardBody, CardFooter, Button, Tabs, Tab } from "@heroui/react";
import type { Snack } from "@/stores/useSnackStore";

interface SelectFoodTabProps {
    snacks: Snack[];
    selectedSnacks: Record<number, number>; // snack_id -> quantity
    isLoading: boolean;
    onUpdateQuantity: (snackId: number, quantity: number) => void;
}

export function SelectFoodTab({
    snacks,
    selectedSnacks,
    isLoading,
    onUpdateQuantity,
}: SelectFoodTabProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("0");

    const getIcon = (type: number) => {
        switch (type) {
            case 0: return <Popcorn size={18} />;
            case 1: return <Coffee size={18} />;
            case 2: return <Gift size={18} />;
            default: return <Popcorn size={18} />;
        }
    };

    const getTypeLabel = (type: number) => {
        switch (type) {
            case 0: return t('foods_tab.types.food');
            case 1: return t('foods_tab.types.drink');
            case 2: return t('foods_tab.types.combo');
            default: return "";
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 rounded-sm">
                        <CardBody className="p-0 aspect-video">
                            <Skeleton className="w-full h-full" />
                        </CardBody>
                        <CardFooter className="flex flex-col gap-3 p-4 items-start">
                            <Skeleton className="w-3/4 h-5 rounded-sm" />
                            <Skeleton className="w-1/2 h-4 rounded-sm" />
                            <div className="flex justify-between w-full mt-2">
                                <Skeleton className="w-20 h-8 rounded-sm" />
                                <Skeleton className="w-24 h-10 rounded-sm" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (snacks.length === 0) {
        return (
            <div className="w-full py-20 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Popcorn size={40} />
                </div>
                <p className="text-zinc-500 font-medium italic">
                    {t('booking.service_tab.no_snacks') || "No snacks available at this time."}
                </p>
            </div>
        );
    }

    const filteredSnacks = snacks.filter(snack => String(snack.type) === activeTab);

    const categories = [
        { id: "0", label: t('foods_tab.types.food'), icon: <Utensils size={16} /> },
        { id: "1", label: t('foods_tab.types.drink'), icon: <CupSoda size={16} /> },
        { id: "2", label: t('foods_tab.types.combo'), icon: <Package size={16} /> },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="sticky top-20 z-20 py-2 bg-[#FDFDFD]/80 dark:bg-[#050505]/80 backdrop-blur-md">
                <Tabs 
                    aria-label="Food Categories" 
                    variant="bordered"
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(String(key))}
                    classNames={{
                        tabList: "w-full sm:w-auto bg-sidebar border-zinc-200 dark:border-white/10 rounded-sm p-1",
                        cursor: "bg-amber-500 rounded-sm shadow-lg shadow-amber-500/20",
                        tab: "h-10 px-4",
                        tabContent: "group-data-[selected=true]:text-white font-black uppercase text-[10px] tracking-widest transition-all"
                    }}
                >
                    {categories.map((cat) => (
                        <Tab 
                            key={cat.id} 
                            title={
                                <div className="flex items-center gap-2">
                                    {cat.icon}
                                    <span>{cat.label}</span>
                                </div>
                            } 
                        />
                    ))}
                </Tabs>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredSnacks.length > 0 ? (
                    filteredSnacks.map((snack) => {
                        const quantity = selectedSnacks[snack.snack_id] || 0;
                        
                        return (
                            <Card 
                                key={snack.snack_id} 
                                className={cn(
                                    "group bg-sidebar border-zinc-200 dark:border-white/10 rounded-sm transition-all duration-300 hover:shadow-xl hover:border-amber-500/30",
                                    quantity > 0 && "border-amber-500 ring-1 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                                )}
                            >
                                <CardBody className="p-0 flex flex-row h-28 sm:h-36">
                                    <div className="relative w-28 sm:w-36 h-full shrink-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950/50 p-3">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={snack.imageUrl || "/h.png"}
                                                alt={snack.name}
                                                fill
                                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-widest flex items-center gap-1 border border-white/10">
                                            {getIcon(snack.type)}
                                            {getTypeLabel(snack.type)}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between p-3 sm:p-5">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <h3 className="font-black text-xs sm:text-base uppercase italic tracking-tighter leading-tight group-hover:text-amber-500 transition-colors line-clamp-1">
                                                    {snack.name}
                                                </h3>
                                                <p className="text-zinc-500 text-[9px] sm:text-[11px] font-medium max-w-sm line-clamp-2 leading-relaxed">
                                                    {snack.type === 2 ? t('foods_tab.desc_combo') : t('foods_tab.desc_single')}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-amber-500 font-black text-xs sm:text-lg tabular-nums">
                                                    {snack.price.toLocaleString()} <span className="text-[9px] sm:text-[10px]">{t('common.currency_vnd')}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end items-center gap-4 sm:gap-6">
                                            {quantity > 0 && (
                                                <p className="hidden xs:block text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                                    {t('booking.sidebar.total')}: <span className="text-zinc-900 dark:text-white">{(snack.price * quantity).toLocaleString()}</span>
                                                </p>
                                            )}

                                            <div className="flex items-center gap-0.5 p-0.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-sm border border-zinc-200 dark:border-white/5">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onClick={() => onUpdateQuantity(snack.snack_id, Math.max(0, quantity - 1))}
                                                    isDisabled={quantity === 0}
                                                    className="min-w-6 w-6 h-6 sm:min-w-8 sm:w-8 sm:h-8 rounded-sm hover:bg-white dark:hover:bg-zinc-700"
                                                >
                                                    <Minus size={10} />
                                                </Button>
                                                
                                                <div className="w-6 sm:w-10 text-center font-black text-[10px] sm:text-sm tabular-nums">
                                                    {quantity}
                                                </div>

                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onClick={() => onUpdateQuantity(snack.snack_id, quantity + 1)}
                                                    className="min-w-6 w-6 h-6 sm:min-w-8 sm:w-8 sm:h-8 rounded-sm hover:bg-white dark:hover:bg-zinc-700 text-amber-500"
                                                >
                                                    <Plus size={10} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })
                ) : (
                    <div className="w-full py-20 text-center space-y-4 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-sm">
                        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                            {getIcon(Number(activeTab))}
                        </div>
                        <p className="text-zinc-500 font-black uppercase italic tracking-widest text-xs">
                            {t('booking.service_tab.no_snacks') || "No items in this category"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

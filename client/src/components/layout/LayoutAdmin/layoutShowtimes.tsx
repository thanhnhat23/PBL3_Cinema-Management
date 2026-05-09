import { Tabs, Tab } from "@heroui/react";
import LayoutShowtime from "./LayoutChild/layoutShowtime";
import LayoutShowtimeSlot from "./LayoutChild/layoutShowtimeSlot";
import LayoutShowtimePrice from "./LayoutChild/layoutShowtimePrice";
import { useTranslation } from "react-i18next";
import { CalendarClock, Clock, Banknote } from "lucide-react";

export default function LayoutShowtimes() {
    const { t } = useTranslation();
    const tabs = [
        { id: "showtime", label: t('showtimes_tab.tabs.showtime'), icon: <CalendarClock size={14} /> },
        { id: "showtimeslot", label: t('showtimes_tab.tabs.slot'), icon: <Clock size={14} /> },
        { id: "showtimeprice", label: t('showtimes_tab.tabs.price'), icon: <Banknote size={14} /> },
    ];

    return (
        <div className="flex flex-col gap-4">
            <Tabs 
                aria-label="Showtime Options" 
                variant="underlined" 
                size="lg" 
                items={tabs}
                classNames={{
                    base: "w-full border-b border-zinc-100 dark:border-zinc-800",
                    tabList: "gap-6 w-full relative rounded-none p-0",
                    cursor: "w-full bg-amber-500",
                    tab: "max-w-fit",
                    tabContent: "group-data-[selected=true]:text-amber-500 font-semibold"
                }}
            >
                {(item) => (
                    <Tab key={item.id} title={<div className="flex items-center gap-2">{item.icon}{item.label}</div>}>
                        {item.id === "showtime" && <LayoutShowtime />}
                        {item.id === "showtimeslot" && <LayoutShowtimeSlot />}
                        {item.id === "showtimeprice" && <LayoutShowtimePrice />}
                    </Tab>
                )}
            </Tabs>
        </div>
    )
}

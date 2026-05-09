import { Tabs, Tab } from "@heroui/react";
import LayoutTickets from "./LayoutChild/layoutTickets";
import LayoutCoupons from "./LayoutChild/layoutCoupons";
import { useTranslation } from "react-i18next";
import { Ticket, TicketIcon } from "lucide-react";

export default function LayoutTicket() {
    const { t } = useTranslation();
    const tabs = [
        { id: "ticket", label: t('ticket_tab.tickets'), icon: <Ticket size={14} /> },
        { id: "coupon", label: t('ticket_tab.coupons'), icon: <TicketIcon size={14} /> },
    ];

    return (
        <div className="flex flex-col gap-4">
            <Tabs 
                aria-label="Options" 
                variant="underlined" 
                size="lg"
                classNames={{
                    base: "w-full border-b border-zinc-100 dark:border-zinc-800",
                    tabList: "gap-6 w-full relative rounded-none p-0",
                    cursor: "w-full bg-amber-500",
                    tab: "max-w-fit",
                    tabContent: "group-data-[selected=true]:text-amber-500 font-semibold"
                }}
            >
                {tabs.map((tab) => (
                    <Tab key={tab.id} title={
                        <div className="flex items-center gap-2">
                            {tab.icon}
                            <span>{tab.label}</span>
                        </div>
                    }>
                        {tab.id === "ticket" && <LayoutTickets />}
                        {tab.id === "coupon" && <LayoutCoupons />}
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
}

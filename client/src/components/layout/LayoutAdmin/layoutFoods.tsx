import { Tabs, Tab } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Pizza, Boxes, Warehouse } from "lucide-react";
import LayoutSnacks from "./LayoutChild/LayoutSnacks";
import LayoutInventory from "./LayoutChild/LayoutInventory";
import LayoutCombo from "./LayoutChild/LayoutCombo";

export default function LayoutFood() {
    const { t } = useTranslation();
    const tabs = [
        { id: "snacks", label: t('foods_tab.title'), icon: <Pizza size={14} /> },
        { id: "inventory", label: t('dashboard.management.inventory'), icon: <Warehouse size={14} /> },
        { id: "combos", label: t('foods_tab.types.combo'), icon: <Boxes size={14} /> },
    ];

    return (
        <div className="flex flex-col gap-4">
            <Tabs
                aria-label="Food Management Options"
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
                        {tab.id === "snacks" && <LayoutSnacks />}
                        {tab.id === "inventory" && <LayoutInventory />}
                        {tab.id === "combos" && <LayoutCombo />}
                    </Tab>  
                ))}
            </Tabs>
        </div>
    )
}

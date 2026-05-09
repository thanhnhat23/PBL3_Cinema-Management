import { Tabs, Tab } from "@heroui/react";
import LayoutLocations from "./LayoutChild/layoutLocations";
import LayoutCinemas from './LayoutChild/layoutCinemas';
import LayoutRooms from "./LayoutChild/layoutRooms";
import { useTranslation } from "react-i18next";
import { MapPin, Clapperboard, DoorOpen } from "lucide-react"; 

export default function LayoutLocation() {
    const { t } = useTranslation();
    const tabs = [
        { id: "location", label: t('location_tab.locations'), icon: <MapPin size={14} /> },
        { id: "cinema", label: t('location_tab.cinemas'), icon: <Clapperboard size={14} /> },
        { id: "room", label: t('location_tab.rooms'), icon: <DoorOpen size={14} /> },
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
                        {tab.id === "location" && <LayoutLocations />}
                        {tab.id === "cinema" && <LayoutCinemas />}
                        {tab.id === "room" && <LayoutRooms />}
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
}

import { Tabs, Tab } from "@heroui/react";
import LayoutActors from "./LayoutChild/layoutActors";
import LayoutReviews from "./LayoutChild/layoutReviews";
import LayoutMovies from "./LayoutChild/layoutMovies";
import { useTranslation } from "react-i18next";
import { Clapperboard, User, MessageCircle } from "lucide-react";

export default function LayoutMovie() {
    const { t } = useTranslation();
    const tabs = [
        { id: "movies", label: t('dashboard.management.movies'), icon: <Clapperboard size={14} /> },
        { id: "actors", label: t('common.actors'), icon: <User size={14} /> },
        { id: "reviews", label: t('common.reviews'), icon: <MessageCircle size={14} /> },
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
                        {tab.id === "movies" && <LayoutMovies />}
                        {tab.id === "actors" && <LayoutActors />}
                        {tab.id === "reviews" && <LayoutReviews />}
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
}

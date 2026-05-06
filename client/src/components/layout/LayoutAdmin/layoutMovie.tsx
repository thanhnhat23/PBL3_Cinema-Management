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
            <Tabs aria-label="Options" variant="underlined" size="lg" items={tabs}>
                {(item) => (
                    <Tab key={item.id} title={<div className="flex items-center gap-2">{item.icon}{item.label}</div>}>
                        {item.id === "movies" && <LayoutMovies />}
                        {item.id === "actors" && <LayoutActors />}
                        {item.id === "reviews" && <LayoutReviews />}
                    </Tab>
                )}
            </Tabs>
        </div>
    )
}
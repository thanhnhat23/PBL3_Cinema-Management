import { Tabs, Tab } from "@heroui/react";
import LayoutActors from "./LayoutChild/layoutActors";
import LayoutReviews from "./LayoutChild/layoutReviews";
import LayoutMovies from "./LayoutChild/layoutMovies";
import { useTranslation } from "react-i18next";

export default function LayoutMovie() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-4">
            <Tabs aria-label="Options" variant="underlined" size="lg">
                <Tab key="movie" title={t('dashboard.management.movies')}>
                    <LayoutMovies />
                </Tab>

                <Tab key="actor" title={t('dashboard.overview_tab.metrics.actors.title')}>
                    <LayoutActors />
                </Tab>

                <Tab key="review" title={t('dashboard.overview_tab.metrics.reviews.title')}>
                    <LayoutReviews />
                </Tab>
            </Tabs>
        </div>
    )
}
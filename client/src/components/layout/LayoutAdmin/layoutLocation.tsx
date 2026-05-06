import { Tabs, Tab } from "@heroui/react";
import LayoutLocations from "./LayoutChild/layoutLocations";
import LayoutCinemas from './LayoutChild/layoutCinemas';
import LayoutRooms from "./LayoutChild/layoutRooms";
import { useTranslation } from "react-i18next";

export default function LayoutLocation() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4">
            <Tabs aria-label="Options" variant="underlined" size="lg">
                <Tab key="location" title={t('location_tab.locations')}>
                    <LayoutLocations />
                </Tab>

                <Tab key="cinema" title={t('location_tab.cinemas')}>
                    <LayoutCinemas />
                </Tab>

                <Tab key="room" title={t('location_tab.rooms')}>
                    <LayoutRooms />
                </Tab>
            </Tabs>
        </div>
    )
}

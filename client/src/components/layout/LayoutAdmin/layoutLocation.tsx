import { Tabs, Tab } from "@heroui/react";
import LayoutLocations from "./LayoutChild/layoutLocations";
import LayoutCinemas from './LayoutChild/layoutCinemas';
import LayoutRooms from "./LayoutChild/layoutRooms";

export default function LayoutLocation() {
    return (
        <div className="flex flex-col gap-4">
            <Tabs aria-label="Options" variant="underlined" size="lg">
                <Tab key="location" title="Địa điểm">
                    <LayoutLocations />
                </Tab>

                <Tab key="cinema" title="Rạp chiếu">
                    <LayoutCinemas />
                </Tab>

                <Tab key="room" title="Phòng chiếu">
                    <LayoutRooms />
                </Tab>
            </Tabs>
        </div>
    )
}

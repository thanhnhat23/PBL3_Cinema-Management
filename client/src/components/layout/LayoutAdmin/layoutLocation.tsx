import { House } from "lucide-react";
import { Tabs, Tab } from "@heroui/react";
import LayoutLocations from "./LayoutChild/layoutLocations";
import LayoutCinemas from './LayoutChild/layoutCinemas';
import LayoutRooms from "./LayoutChild/layoutRooms";

export default function LayoutLocation() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <House />
                Dashboard: Quản lí địa điểm - rạp - phòng chiếu
            </h1>

            <Tabs aria-label="Options" variant="underlined">
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

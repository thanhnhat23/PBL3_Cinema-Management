import { Tabs, Tab } from "@heroui/react";
import { Video } from "lucide-react";
import LayoutActors from "./LayoutChild/layoutActors";
import LayoutReviews from "./LayoutChild/layoutReviews";
import LayoutMovies from "./LayoutChild/layoutMovies";

export default function LayoutMovie() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Video />
                Dashboard: Quản lí phim - diễn viên - đánh giá
            </h1>

            <Tabs aria-label="Options" variant="underlined">
                <Tab key="movie" title="Phim">
                    <LayoutMovies />
                </Tab>

                <Tab key="actor" title="Diễn viên">
                    <LayoutActors />
                </Tab>

                <Tab key="review" title="Đánh giá">
                    <LayoutReviews />
                </Tab>
            </Tabs>
        </div>
    )
}
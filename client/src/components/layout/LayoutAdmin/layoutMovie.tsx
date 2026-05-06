import { Tabs, Tab } from "@heroui/react";
import LayoutActors from "./LayoutChild/layoutActors";
import LayoutReviews from "./LayoutChild/layoutReviews";
import LayoutMovies from "./LayoutChild/layoutMovies";

export default function LayoutMovie() {
    return (
        <div className="flex flex-col gap-4">
            <Tabs aria-label="Options" variant="underlined" size="lg">
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
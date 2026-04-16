'use client';

import { LayoutOverview } from "./LayoutAdmin/layoutOverview";
import LayoutMovies from "./LayoutAdmin/layoutMovies";
import LayoutRooms from "./LayoutAdmin/layoutRooms";
import LayoutTickets from "./LayoutAdmin/layoutTickets";
import LayoutShowtimes from "./LayoutAdmin/layoutShowtimes";
import LayoutCinemas from "./LayoutAdmin/layoutCinemas";
import LayoutCoupons from "./LayoutAdmin/layoutCoupons";
import LayoutActors from "./LayoutAdmin/layoutActors";
import LayoutReviews from "./LayoutAdmin/layoutReviews";
import LayoutUsers from "./LayoutAdmin/layoutUsers";
import LayoutSyncData from "./LayoutAdmin/layoutSyncData";
import LayoutStatistics from "./LayoutAdmin/layoutStatistics";
import LayoutFood from "./LayoutAdmin/layoutFoods";

export const LayoutAdmin = ({
    openLayout,
    selectValue
}: {
    openLayout: string;
    selectValue: string;
}) => {
    return (
        <div className="p-4">
            {openLayout === "Thống kê" && <LayoutOverview selectValue={selectValue} />}
            {openLayout === "Phim" && <LayoutMovies />}
            {openLayout === "Phòng" && <LayoutRooms />}
            {openLayout === "Vé" && <LayoutTickets />}
            {openLayout === "Suất chiếu" && <LayoutShowtimes />}
            {openLayout === "Rạp chiếu" && <LayoutCinemas />}
            {openLayout === "Khuyến mãi" && <LayoutCoupons />}
            {openLayout === "Diễn viên" && <LayoutActors />}
            {openLayout === "Review" && <LayoutReviews />}
            {openLayout === "Người dùng" && <LayoutUsers />}
            {openLayout === "Đồng bộ dữ liệu" && <LayoutSyncData />}
            {openLayout === "Thống kê doanh thu" && <LayoutStatistics />}
            {openLayout === "Thức ăn" && <LayoutFood />}
        </div>
    )
}
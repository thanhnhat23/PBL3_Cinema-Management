'use client';

import { LayoutOverview } from "./LayoutAdmin/layoutOverview";
import LayoutMovie from "./LayoutAdmin/layoutMovie";
import LayoutTicket from "./LayoutAdmin/layoutTicket";
import LayoutShowtimes from "./LayoutAdmin/layoutShowtimes";
import LayoutLocation from "./LayoutAdmin/layoutLocation";
import LayoutUsers from "./LayoutAdmin/layoutUsers";
import LayoutSyncData from "./LayoutAdmin/layoutSyncData";
import LayoutStatistics from "./LayoutAdmin/layoutStatistics";
import LayoutFood from "./LayoutAdmin/layoutFoods";
import React from "react";

export const LayoutAdmin = React.memo(({
    openLayout,
    selectValue
}: {
    openLayout: string;
    selectValue: string;
}) => {
    return (
        <div className="p-4">
            {openLayout === "Thống kê" && <LayoutOverview selectValue={selectValue} />}
            {openLayout === "Phim" && <LayoutMovie />}
            {openLayout === "Vé" && <LayoutTicket />}
            {openLayout === "Suất chiếu" && <LayoutShowtimes />}
            {openLayout === "Rạp chiếu" && <LayoutLocation />}
            {openLayout === "Người dùng" && <LayoutUsers />}
            {openLayout === "Đồng bộ dữ liệu" && <LayoutSyncData />}
            {openLayout === "Thống kê doanh thu" && <LayoutStatistics />}
            {openLayout === "Thức ăn" && <LayoutFood />}
        </div>
    )
})

LayoutAdmin.displayName = "LayoutAdmin";
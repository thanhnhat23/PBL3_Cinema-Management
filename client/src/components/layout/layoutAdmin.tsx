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
            {openLayout === "stats" && <LayoutOverview selectValue={selectValue} />}
            {openLayout === "movies" && <LayoutMovie />}
            {openLayout === "tickets" && <LayoutTicket />}
            {openLayout === "showtimes" && <LayoutShowtimes />}
            {openLayout === "cinemas" && <LayoutLocation />}
            {openLayout === "users" && <LayoutUsers />}
            {openLayout === "sync" && <LayoutSyncData />}
            {openLayout === "revenue" && <LayoutStatistics />}
            {openLayout === "foods" && <LayoutFood />}
        </div>
    )
})

LayoutAdmin.displayName = "LayoutAdmin";
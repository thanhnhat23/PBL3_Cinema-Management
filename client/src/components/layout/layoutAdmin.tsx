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
import LayoutTrash from "./LayoutAdmin/layoutTrash";
import React from "react";
import { LayoutKey } from "@/stores/useLayoutStore";

export const LayoutAdmin = React.memo(({
    openLayout,
    selectValue
}: {
    openLayout: LayoutKey;
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
            {openLayout === "trash" && <LayoutTrash />}
        </div>
    )
})

LayoutAdmin.displayName = "LayoutAdmin";
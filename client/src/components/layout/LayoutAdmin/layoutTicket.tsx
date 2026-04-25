import { User } from "lucide-react";
import { Tabs, Tab } from "@heroui/react";
import LayoutTickets from "./LayoutChild/layoutTickets";
import LayoutCoupons from "./LayoutChild/layoutCoupons";

export default function LayoutTicket() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <User />
                Dashboard: Quản lí vé - khuyến mãi
            </h1>

            <Tabs aria-label="Options" variant="underlined">
                <Tab key="ticket" title="Vé">
                    <LayoutTickets />
                </Tab>

                <Tab key="coupon" title="Khuyến mãi">
                    <LayoutCoupons />
                </Tab>
            </Tabs>
        </div>
    )
}

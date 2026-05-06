import { Tabs, Tab } from "@heroui/react";
import LayoutTickets from "./LayoutChild/layoutTickets";
import LayoutCoupons from "./LayoutChild/layoutCoupons";

export default function LayoutTicket() {
    return (
        <div className="flex flex-col gap-4">
            <Tabs aria-label="Options" variant="underlined" size="lg">
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

import { Tabs, Tab } from "@heroui/react";
import LayoutTickets from "./LayoutChild/layoutTickets";
import LayoutCoupons from "./LayoutChild/layoutCoupons";
import { useTranslation } from "react-i18next";

export default function LayoutTicket() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4">
            <Tabs aria-label="Options" variant="underlined" size="lg">
                <Tab key="ticket" title={t('ticket_tab.tickets')}>
                    <LayoutTickets />
                </Tab>

                <Tab key="coupon" title={t('ticket_tab.coupons')}>
                    <LayoutCoupons />
                </Tab>
            </Tabs>
        </div>
    )
}

"use client"

import { ChartLine } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslation } from "react-i18next";
import { useBookingStore } from "@/stores/useBookingStore";

export const description = "A line chart with a label"

const getChartConfig = (color: string, t: (key: string) => string): ChartConfig => ({
  ticket: {
    label: t('dashboard.management.tickets'),
    color: color,
  },
})

export const ChartLineCard = React.memo(({ color }: { color: string }) => {
  const { t } = useTranslation();
  const { bookings, fetchAllBookings } = useBookingStore();

  React.useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const chartConfig = getChartConfig(color, t);

  const data = React.useMemo(() => {
    const monthKeys = [
      t('months.january'),
      t('months.february'), 
      t('months.march'), 
      t('months.april'), 
      t('months.may'), 
      t('months.june'),
      t('months.july'), 
      t('months.august'), 
      t('months.september'), 
      t('months.october'), 
      t('months.november'), 
      t('months.december')
    ];

    const months = monthKeys.map(key => ({
      month: key,
      ticket: 0,
    }));

    bookings.forEach(booking => {
      const status = String(booking.status).toLowerCase();
      if (status === "1" || status === "confirmed") {
        const date = new Date(booking.createAt);
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          months[monthIndex].ticket += 1;
        }
      }
    });

    return months;
  }, [bookings, t]);

  return (
    <Card className="flex flex-col bg-sidebar">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex gap-2 items-center font-bold text-xl">
          <ChartLine size={20} />
          {t('dashboard.charts.ticket_monthly.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.charts.ticket_monthly.desc')}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Line
              dataKey="ticket"
              type="natural"
              stroke="var(--color-ticket)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-ticket)",
              }}
              activeDot={{
                r: 6,
              }}
              style={{
                filter:
                  `drop-shadow(0 0 4px ${color})`,
              }}
              className="h-96 w-full"
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})

ChartLineCard.displayName = "ChartLineCard";
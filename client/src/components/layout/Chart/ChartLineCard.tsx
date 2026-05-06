"use client"

import { ChartLine } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

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

export const description = "A line chart with a label"

const getChartData = (t: any) => [
  { month: t('months.january'), ticket: 186 },
  { month: t('months.february'), ticket: 305 },
  { month: t('months.march'), ticket: 237 },
  { month: t('months.april'), ticket: 73 },
  { month: t('months.may'), ticket: 209 },
  { month: t('months.june'), ticket: 214 },
  { month: t('months.july'), ticket: 186 },
  { month: t('months.august'), ticket: 305 },
  { month: t('months.september'), ticket: 237 },
  { month: t('months.october'), ticket: 73 },
  { month: t('months.november'), ticket: 209 },
  { month: t('months.december'), ticket: 214 },
]

const getChartConfig = (color: string, t: any): ChartConfig => ({
  ticket: {
    label: t('dashboard.management.tickets'),
    color: color,
  },
})

import React from "react"
export const ChartLineCard = React.memo(({ color }: { color: string }) => {
  const { t } = useTranslation();
  const chartConfig = getChartConfig(color, t);
  const data = React.useMemo(() => getChartData(t), [t]);

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
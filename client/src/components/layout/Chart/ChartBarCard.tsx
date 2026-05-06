"use client"

import { ChartColumnBig } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

export interface BarChartItem {
  month: string
  movie: number
}

const getChartConfig = (color: string, t: any): ChartConfig => ({
  movie: {
    label: t('dashboard.management.movies'),
    color: color,
  },
})

import React from "react"
export const ChartBarCard = React.memo(({ color, data }: { color: string; data: BarChartItem[] }) => {
  const { t } = useTranslation();
  const chartConfig = getChartConfig(color, t);

  return (
    <Card className="flex flex-col bg-sidebar">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex gap-2 items-center font-bold text-xl">
            <ChartColumnBig size={20} />
            {t('dashboard.charts.movie_monthly.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.charts.movie_monthly.desc')}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar 
              dataKey="movie" 
              fill="var(--color-movie)" 
              radius={8}
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
            </Bar>

          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})

ChartBarCard.displayName = "ChartBarCard";
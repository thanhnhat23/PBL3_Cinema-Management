"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart } from "recharts"
import { ChartPie } from 'lucide-react';

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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslation } from "react-i18next";

export interface PieChartItem {
  status: 'released' | 'upcoming' | 'ended'
  total: number
}

const getChartConfig = (colors: [string, string, string], t: any): ChartConfig => ({
  released: {
    label: t('movie_status.released'),
    color: colors[0],
  },
  upcoming: {
    label: t('movie_status.upcoming'),
    color: colors[1],
  },
  ended: {
    label: t('movie_status.ended'),
    color: colors[2],
  },
} satisfies ChartConfig)

export const ChartPieCard = React.memo(({ color, data }: { color: [string, string, string]; data: PieChartItem[] }) => {
  const { t } = useTranslation();
  const chartConfig = getChartConfig(color, t);

  const totalMovies = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.total, 0)
  }, [data])

  return (
    <Card className="flex flex-col bg-sidebar">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex gap-2 items-center font-bold text-xl">
            <ChartPie size={20} />
            {t('dashboard.charts.movie_status.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.charts.movie_status.desc')}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="status" />}
            />

            <Pie
              data={data}
              dataKey="total"
              nameKey="status"
              innerRadius={100}
              strokeWidth={0}
              style={{
                filter:
                  `drop-shadow(0 0 4px ${color[0]})`, 
              }}
              className="h-96 w-full"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.status}`} fill={color[index]} />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold"
                          fill="gray"
                        >
                          {totalMovies.toLocaleString()}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          fill="gray"
                        >
                          {t('dashboard.charts.movie_status.label')}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>

            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-8 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})

ChartPieCard.displayName = "ChartPieCard";
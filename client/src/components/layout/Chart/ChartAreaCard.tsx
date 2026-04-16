"use client"

import { ChartArea } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export interface AreaChartItem {
  genre: string
  movie: number
}

const getChartConfig = (color: string): ChartConfig => ({
  movie: {
    label: "Movie",
    color: color,
  }
})

export const ChartAreaCard = ({ color, data }: { color: string; data: AreaChartItem[] }) => {
  const chartConfig = getChartConfig(color);

  return (
    <Card className="flex flex-col bg-sidebar">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex gap-2 items-center font-bold text-xl">
            <ChartArea size={20} />
            Thống kê xu hướng thể loại phim
        </CardTitle>
        <CardDescription>Tổng số lượng phim theo từng thể loại</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="genre"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickCount={3}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillMovie" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-movie)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-movie)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="movie"
              type="natural"
              fill="url(#fillMovie)"
              fillOpacity={0.4}
              stroke="var(--color-movie)"
              stackId="a"
              style={{
                filter:
                  `drop-shadow(0 0 4px ${color})`,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

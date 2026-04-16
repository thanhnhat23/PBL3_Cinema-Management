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

export const description = "A line chart with a label"

const chartData = [
  { month: "January", ticket: 186 },
  { month: "February", ticket: 305 },
  { month: "March", ticket: 237 },
  { month: "April", ticket: 73 },
  { month: "May", ticket: 209 },
  { month: "June", ticket: 214 },
  { month: "July", ticket: 186 },
  { month: "August", ticket: 305 },
  { month: "September", ticket: 237 },
  { month: "October", ticket: 73 },
  { month: "November", ticket: 209 },
  { month: "December", ticket: 214 },
]

const getChartConfig = (color: string): ChartConfig => ({
  ticket: {
    label: "Ticket",
    color: color,
  },
})

export const ChartLineCard = ({ color }: { color: string }) => {
  const chartConfig = getChartConfig(color);

  return (
    <Card className="flex flex-col bg-sidebar">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex gap-2 items-center font-bold text-xl">
            <ChartLine size={20} />
            Thống kê số lượng vé bán ra theo tháng
        </CardTitle>
        <CardDescription>Cập nhật từ tháng 1 đến tháng 12</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
}

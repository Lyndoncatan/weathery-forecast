"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface WeatherChartProps {
  data: Array<{
    time: string
    temp: number
    min: number
    max: number
  }>
  isLoading?: boolean
}

export function WeatherChart({ data, isLoading = false }: WeatherChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <ChartContainer
      config={{
        temp: {
          label: "Temperature",
          color: "hsl(210, 100%, 60%)",
        },
        min: {
          label: "Min Temp",
          color: "hsl(210, 70%, 80%)",
        },
        max: {
          label: "Max Temp",
          color: "hsl(4, 90%, 60%)",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            tickCount={5}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
            unit="°C"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="min" stackId="1" stroke="hsl(210, 70%, 80%)" fill="hsl(210, 70%, 95%)" />
          <Area type="monotone" dataKey="temp" stackId="2" stroke="hsl(210, 100%, 60%)" fill="hsl(210, 100%, 90%)" />
          <Area type="monotone" dataKey="max" stackId="3" stroke="hsl(4, 90%, 60%)" fill="hsl(4, 90%, 95%)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


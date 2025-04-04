import type { ReactNode } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface WeatherCardProps {
  icon: ReactNode
  title: string
  value: string
  description: string
  trend?: string
  trendUp?: boolean | null
  isLoading?: boolean
}

export function WeatherCard({ icon, title, value, description, trend, trendUp, isLoading = false }: WeatherCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-primary">{value}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            {trendUp !== null &&
              (trendUp ? (
                <ArrowUp className="h-3 w-3 text-red-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-green-500" />
              ))}
            <span
              className={`${trendUp === true ? "text-red-500" : trendUp === false ? "text-green-500" : "text-primary-foreground"}`}
            >
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


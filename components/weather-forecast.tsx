import { CloudDrizzle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ForecastItem {
  day: string
  date: string
  icon: string
  temp: string
  description: string
  precipitation: string
}

interface WeatherForecastProps {
  forecastData: ForecastItem[]
  isLoading?: boolean
}

export function WeatherForecast({ forecastData, isLoading = false }: WeatherForecastProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {Array(7)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="text-center">
                  <Skeleton className="h-5 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto mb-3" />
                  <Skeleton className="h-12 w-12 mx-auto rounded-full mb-3" />
                  <Skeleton className="h-6 w-14 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto mb-2" />
                  <Skeleton className="h-4 w-10 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
      {forecastData.map((forecast, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="font-medium text-primary">{forecast.day}</div>
              <div className="text-xs text-muted-foreground">{forecast.date}</div>
              <div className="my-3 flex justify-center">
                {/* Use img tag instead of Image for better compatibility */}
                <img
                  src={forecast.icon || "/placeholder.svg?height=50&width=50"}
                  alt={forecast.description}
                  width={50}
                  height={50}
                  className="h-[50px] w-[50px]"
                  onError={(e) => {
                    // Fallback to placeholder if icon fails to load
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=50&width=50"
                  }}
                />
              </div>
              <div className="text-xl font-bold text-primary">{forecast.temp}</div>
              <div className="mt-1 text-sm text-muted-foreground">{forecast.description}</div>
              <div className="mt-2 text-xs text-primary">
                <span className="inline-flex items-center gap-1">
                  <CloudDrizzle className="h-3 w-3" />
                  {forecast.precipitation}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WeatherMapProps {
  lat: number
  lon: number
  zoom?: number
  isLoading?: boolean
  apiKey: string
}

export function WeatherMap({ lat, lon, zoom = 10, isLoading = false, apiKey }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<string>("temp_new")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // OpenWeatherMap layers
  const layers = [
    { id: "temp_new", name: "Temperature" },
    { id: "precipitation_new", name: "Precipitation" },
    { id: "clouds_new", name: "Clouds" },
    { id: "wind_new", name: "Wind" },
    { id: "pressure_new", name: "Pressure" },
  ]

  // Build the OpenWeatherMap URL
  const getMapUrl = (layer: string) => {
    return `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${layer}&lat=${lat}&lon=${lon}&zoom=${zoom}`
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveLayer(value)
    if (iframeRef.current) {
      iframeRef.current.src = getMapUrl(value)
    }
  }

  // Handle iframe load
  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-md" />
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary p-3">
          <Tabs defaultValue={activeLayer} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-secondary">
              {layers.map((layer) => (
                <TabsTrigger
                  key={layer.id}
                  value={layer.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {layer.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="relative h-[400px] w-full">
          {!iframeLoaded && <Skeleton className="absolute inset-0 z-10" />}
          <iframe
            ref={iframeRef}
            src={getMapUrl(activeLayer)}
            width="100%"
            height="400"
            frameBorder="0"
            title="Weather Map"
            className="w-full h-full"
            onLoad={handleIframeLoad}
          />
        </div>
      </CardContent>
    </Card>
  )
}


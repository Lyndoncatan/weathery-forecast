import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StaticMapProps {
  lat: number
  lon: number
  zoom?: number
  width?: number
  height?: number
  isLoading?: boolean
}

export function StaticMap({ lat, lon, zoom = 12, width = 600, height = 300, isLoading = false }: StaticMapProps) {
  // Use Google Maps static image API which is more reliable
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${lat},${lon}&key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg`

  // Fallback to OpenStreetMap if Google Maps doesn't work
  const fallbackMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lon},red`

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-md" />
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden rounded-md">
        <div className="h-[300px] w-full relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mapUrl || "/placeholder.svg"}
            alt="Location Map"
            className="w-full h-full object-cover"
            width={width}
            height={height}
            onError={(e) => {
              // If Google Maps fails, try OpenStreetMap
              ;(e.target as HTMLImageElement).src = fallbackMapUrl
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}


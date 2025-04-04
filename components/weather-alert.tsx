import { AlertTriangle } from "lucide-react"

interface WeatherAlertProps {
  title: string
  description: string
  severity?: "low" | "medium" | "high"
}

export function WeatherAlert({ title, description, severity = "medium" }: WeatherAlertProps) {
  const bgColor = {
    low: "bg-blue-50 border-blue-200",
    medium: "bg-amber-50 border-amber-200",
    high: "bg-red-50 border-red-200",
  }

  const textColor = {
    low: "text-blue-600",
    medium: "text-amber-600",
    high: "text-red-600",
  }

  const titleColor = {
    low: "text-blue-800",
    medium: "text-amber-800",
    high: "text-red-800",
  }

  return (
    <div className={`rounded-lg border p-4 ${bgColor[severity]}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className={`h-5 w-5 ${textColor[severity]}`} />
        <h3 className={`font-medium ${titleColor[severity]}`}>{title}</h3>
      </div>
      <p className={`mt-2 text-sm ${textColor[severity]}`}>{description}</p>
    </div>
  )
}


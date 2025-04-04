"use client"

import { useEffect, useState } from "react"
import { Compass, Droplets, Thermometer, Wind } from "lucide-react"
import Link from "next/link"

import { WeatherCard } from "@/components/weather-card"
import { WeatherChart } from "@/components/weather-chart"
import { WeatherForecast } from "@/components/weather-forecast"
import { LocationSelector } from "@/components/location-selector"
import { WeatherAlert } from "@/components/weather-alert"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  getCurrentWeather,
  getForecast,
  getWeatherIcon,
  formatDate,
  formatTime,
  type WeatherData,
  type ForecastData,
  getCityCoordinates,
  storeApiKey,
} from "@/lib/weather-service"
const OPENWEATHER_API_KEY = "5405970a7441348eba881f53a5c383ef" // Primary API key
const BACKUP_API_KEY = "7c1412542ba10cafb96e718d0c54b124" // Backup API key

// Import the WeatherMap component
import { WeatherMap } from "@/components/weather-map"

// Fallback data in case API fails
const FALLBACK_FORECAST = [
  {
    day: "Today",
    date: "Apr 4",
    icon: "https://openweathermap.org/img/wn/01d@2x.png",
    temp: "32°C",
    description: "Sunny",
    precipitation: "0%",
  },
  {
    day: "Tomorrow",
    date: "Apr 5",
    icon: "https://openweathermap.org/img/wn/02d@2x.png",
    temp: "30°C",
    description: "Partly Cloudy",
    precipitation: "10%",
  },
  {
    day: "Sunday",
    date: "Apr 6",
    icon: "https://openweathermap.org/img/wn/03d@2x.png",
    temp: "29°C",
    description: "Cloudy",
    precipitation: "20%",
  },
  {
    day: "Monday",
    date: "Apr 7",
    icon: "https://openweathermap.org/img/wn/10d@2x.png",
    temp: "28°C",
    description: "Light Rain",
    precipitation: "40%",
  },
  {
    day: "Tuesday",
    date: "Apr 8",
    icon: "https://openweathermap.org/img/wn/09d@2x.png",
    temp: "27°C",
    description: "Heavy Rain",
    precipitation: "80%",
  },
  {
    day: "Wednesday",
    date: "Apr 9",
    icon: "https://openweathermap.org/img/wn/10d@2x.png",
    temp: "28°C",
    description: "Light Rain",
    precipitation: "30%",
  },
  {
    day: "Thursday",
    date: "Apr 10",
    icon: "https://openweathermap.org/img/wn/02d@2x.png",
    temp: "29°C",
    description: "Partly Cloudy",
    precipitation: "10%",
  },
]

const FALLBACK_CHART_DATA = [
  { time: "9 AM", temp: 28, min: 26, max: 30 },
  { time: "12 PM", temp: 32, min: 28, max: 34 },
  { time: "3 PM", temp: 33, min: 30, max: 35 },
  { time: "6 PM", temp: 30, min: 28, max: 32 },
  { time: "9 PM", temp: 28, min: 26, max: 30 },
  { time: "12 AM", temp: 27, min: 25, max: 29 },
  { time: "3 AM", temp: 26, min: 24, max: 28 },
  { time: "6 AM", temp: 27, min: 25, max: 29 },
]

export default function Home() {
  const [selectedCity, setSelectedCity] = useState("manila")
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<any[]>(FALLBACK_CHART_DATA)
  const [forecastData, setForecastData] = useState<any[]>(FALLBACK_FORECAST)
  const [apiKeyValid, setApiKeyValid] = useState(true)
  const [customApiKey, setCustomApiKey] = useState("")

  // Get coordinates for the selected city
  const cityCoords = getCityCoordinates(selectedCity)

  // Function to save custom API key
  const saveApiKey = () => {
    if (customApiKey.trim()) {
      storeApiKey(customApiKey.trim())
      window.location.reload()
    }
  }

  useEffect(() => {
    // Store the environment variable API key in localStorage if available
    if (process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      storeApiKey(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY)
    }

    async function fetchWeatherData() {
      setIsLoading(true)
      setError(null)

      try {
        console.log("Fetching weather data for:", selectedCity)

        // Fetch current weather
        let weatherData
        try {
          weatherData = await getCurrentWeather(selectedCity)
          setCurrentWeather(weatherData)
        } catch (err) {
          console.error("Error fetching current weather:", err)
          if (String(err).includes("API key is missing")) {
            setApiKeyValid(false)
            throw new Error("OpenWeather API key is missing. Please add your API key to the environment variables.")
          }
          throw new Error(`Current weather error: ${err instanceof Error ? err.message : String(err)}`)
        }

        // Fetch forecast
        let forecastData
        try {
          forecastData = await getForecast(selectedCity)
          setForecast(forecastData)
        } catch (err) {
          console.error("Error fetching forecast:", err)
          if (!String(err).includes("API key is missing")) {
            throw new Error(`Forecast error: ${err instanceof Error ? err.message : String(err)}`)
          }
        }

        // Process chart data
        if (forecastData && forecastData.list) {
          const chartData = forecastData.list.slice(0, 8).map((item) => ({
            time: formatTime(item.dt),
            temp: Math.round(item.main.temp),
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
          }))
          setChartData(chartData)
        }

        // Process forecast data
        if (forecastData && forecastData.list) {
          const dailyForecasts: Record<string, any> = {}

          forecastData.list.forEach((item) => {
            const date = new Date(item.dt * 1000).toDateString()

            if (!dailyForecasts[date] || new Date(item.dt * 1000).getHours() === 12) {
              dailyForecasts[date] = {
                day: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
                date: formatDate(item.dt),
                icon: getWeatherIcon(item.weather[0].icon),
                temp: `${Math.round(item.main.temp)}°C`,
                description: item.weather[0].description,
                precipitation: `${Math.round(item.pop * 100)}%`,
              }
            }
          })

          setForecastData(Object.values(dailyForecasts).slice(0, 7))
        }
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError(`${err instanceof Error ? err.message : String(err)}`)

        // Check if it's an API key issue
        if (String(err).includes("API key is missing")) {
          setApiKeyValid(false)
        }

        // Keep any data we might have already fetched
        if (!currentWeather) {
          setIsLoading(false)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherData()
  }, [selectedCity])

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
  }

  // If API key is invalid, show a special message
  if (!apiKeyValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4">
        <div className="max-w-md text-center">
          <Compass className="h-12 w-12 text-sky-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-sky-900 mb-2">Weathery</h1>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 mb-4">{error}</div>
          <p className="text-muted-foreground mb-4">Please enter your OpenWeatherMap API key below:</p>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter your API key"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
            />
            <Button onClick={saveApiKey} className="bg-sky-500 hover:bg-sky-600">
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            You can get a free API key from{" "}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
          <Button onClick={() => window.location.reload()} className="bg-sky-500 hover:bg-sky-600">
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-10 border-b bg-primary text-white backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-sky-500" />
            <span className="text-xl font-bold text-white">Weathery</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-medium text-white hover:text-blue-100">
              Dashboard
            </Link>
            <Link href="#" className="text-sm font-medium text-blue-100 hover:text-white">
              Analytics
            </Link>
            <Link href="#" className="text-sm font-medium text-blue-100 hover:text-white">
              Alerts
            </Link>
            <Link href="#" className="text-sm font-medium text-blue-100 hover:text-white">
              Settings
            </Link>
          </nav>
          {/* Replace the old button with our new MobileNav component */}
          <MobileNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Weather Analytics</h1>
              <p className="text-muted-foreground">
                {currentWeather ? (
                  <>Stay updated with the latest weather in {currentWeather.name}, Philippines</>
                ) : (
                  <>Stay updated with the latest weather in {cityCoords.name}, Philippines</>
                )}
              </p>
            </div>
            <LocationSelector selectedCity={selectedCity} onCityChange={handleCityChange} />
          </div>
        </section>

        {error && !error.includes("API key is missing") && (
          <section className="container py-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <p className="font-medium">Warning: {error}</p>
              <p className="text-sm mt-1">Showing fallback data. Some features may be limited.</p>
            </div>
          </section>
        )}

        <section className="container py-4">
          <div className="grid gap-4 md:grid-cols-4">
            <WeatherCard
              icon={<Thermometer className="h-6 w-6 text-amber-500" />}
              title="Temperature"
              value={currentWeather ? `${Math.round(currentWeather.main.temp)}°C` : "32°C"}
              description={
                currentWeather ? `Feels like ${Math.round(currentWeather.main.feels_like)}°C` : "Feels like 35°C"
              }
              isLoading={isLoading}
            />
            <WeatherCard
              icon={<Droplets className="h-6 w-6 text-blue-500" />}
              title="Humidity"
              value={currentWeather ? `${currentWeather.main.humidity}%` : "78%"}
              description={
                currentWeather
                  ? currentWeather.main.humidity > 70
                    ? "High humidity"
                    : "Normal humidity"
                  : "High humidity"
              }
              isLoading={isLoading}
            />
            <WeatherCard
              icon={<Wind className="h-6 w-6 text-sky-500" />}
              title="Wind Speed"
              value={currentWeather ? `${Math.round(currentWeather.wind.speed * 3.6)} km/h` : "12 km/h"}
              description={currentWeather ? `Direction: ${getWindDirection(currentWeather.wind.deg)}` : "Direction: NE"}
              isLoading={isLoading}
            />
            <WeatherCard
              icon={
                <svg
                  className="h-6 w-6 text-yellow-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M22 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M19.7782 4.22183L18.364 5.63604"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5.63608 18.364L4.22187 19.7782"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19.7782 19.7782L18.364 18.364"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5.63608 5.63604L4.22187 4.22183"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
              title="Visibility"
              value={currentWeather ? `${Math.round(currentWeather.visibility / 1000)} km` : "10 km"}
              description={currentWeather ? getVisibilityDescription(currentWeather.visibility) : "Excellent"}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Map Section */}
        <section className="container py-6">
          <h2 className="mb-4 text-xl font-semibold text-primary">Weather Map</h2>
          <WeatherMap
            lat={cityCoords.lat}
            lon={cityCoords.lon}
            zoom={10}
            isLoading={isLoading}
            apiKey={OPENWEATHER_API_KEY}
          />
        </section>

        <section className="container py-6">
          <Card className="border-blue-100 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-primary">Temperature Trends</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Daily
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-primary text-xs text-white">
                    Weekly
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Monthly
                  </Button>
                </div>
              </div>
              <WeatherChart data={chartData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </section>

        <section className="container py-6">
          <h2 className="mb-4 text-xl font-semibold text-primary">7-Day Forecast</h2>
          <WeatherForecast forecastData={forecastData} isLoading={isLoading} />
        </section>

        <section className="container py-6">
          <Card className="border-blue-100 shadow-md">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-primary">Weather Alerts</h2>
              {currentWeather && currentWeather.weather[0].main === "Rain" ? (
                <WeatherAlert
                  title="Heavy Rain Warning"
                  description={`Heavy rainfall expected in ${currentWeather.name}. Possible flooding in low-lying areas. Please take necessary precautions.`}
                />
              ) : currentWeather && currentWeather.main.temp > 32 ? (
                <WeatherAlert
                  title="Extreme Heat Warning"
                  description={`High temperatures expected in ${currentWeather.name}. Stay hydrated and avoid prolonged exposure to the sun.`}
                  severity="high"
                />
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No active weather alerts for {currentWeather?.name || cityCoords.name}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="border-t bg-primary text-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-white md:text-left">
            &copy; {new Date().getFullYear()} Weathery. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-blue-100 hover:text-white">
              Terms
            </Link>
            <Link href="#" className="text-sm text-blue-100 hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-blue-100 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

function getVisibilityDescription(visibility: number): string {
  if (visibility >= 10000) return "Excellent"
  if (visibility >= 5000) return "Good"
  if (visibility >= 2000) return "Moderate"
  return "Poor"
}


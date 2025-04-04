import type React from "react"
// Check if we're in the browser
const isBrowser = typeof window !== "undefined"

// Get API key with fallback for when environment variables aren't available
const getApiKey = () => {
  // Try to get from environment variable first
  const envApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  if (envApiKey) {
    return envApiKey
  }

  // If we're in the browser and the key isn't available from env, try localStorage
  if (isBrowser) {
    const storedApiKey = localStorage.getItem("openweather_api_key")
    if (storedApiKey) {
      return storedApiKey
    }
  }

  // Use the provided API keys as fallback
  return "5405970a7441348eba881f53a5c383ef" // Primary API key
}

// Store API key in localStorage for persistence
export const storeApiKey = (apiKey: string) => {
  if (isBrowser) {
    localStorage.setItem("openweather_api_key", apiKey)
  }
}

const API_KEY = getApiKey()
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export interface WeatherData {
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  name: string
  dt: number
  timezone: number
  visibility: number
  clouds: {
    all: number
  }
  coord: {
    lat: number
    lon: number
  }
}

export interface ForecastData {
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    wind: {
      speed: number
      deg: number
    }
    clouds: {
      all: number
    }
    pop: number // Probability of precipitation
    dt_txt: string
  }>
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

// City coordinates for direct lat/lon API calls
export const CITY_COORDINATES = {
  manila: { lat: 14.5995, lon: 120.9842, name: "Manila" },
  "quezon-city": { lat: 14.676, lon: 121.0437, name: "Quezon City" },
  cebu: { lat: 10.3157, lon: 123.8854, name: "Cebu City" },
  davao: { lat: 7.1907, lon: 125.4553, name: "Davao City" },
  baguio: { lat: 16.4023, lon: 120.596, name: "Baguio City" },
  tagaytay: { lat: 14.1153, lon: 120.9622, name: "Tagaytay" },
  boracay: { lat: 11.9674, lon: 121.9248, name: "Boracay" },
  palawan: { lat: 9.8349, lon: 118.7384, name: "Palawan" },
  iloilo: { lat: 10.7202, lon: 122.5621, name: "Iloilo City" },
  batangas: { lat: 13.7565, lon: 121.0583, name: "Batangas" },
}

// Get coordinates for a city
export function getCityCoordinates(city: string) {
  return CITY_COORDINATES[city as keyof typeof CITY_COORDINATES] || { lat: 14.5995, lon: 120.9842, name: "Manila" }
}

// Use coordinates instead of city names for more reliable API calls
export async function getCurrentWeather(city: string): Promise<WeatherData> {
  try {
    const apiKey = getApiKey()
    if (!apiKey) {
      throw new Error("API key is missing")
    }

    const coords = CITY_COORDINATES[city as keyof typeof CITY_COORDINATES]

    if (!coords) {
      throw new Error(`Unknown city: ${city}`)
    }

    const url = `${BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`
    console.log("Fetching weather from:", url.replace(apiKey, "API_KEY_HIDDEN"))

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    return response.json()
  } catch (error) {
    console.error("getCurrentWeather error:", error)
    throw new Error(`Failed to fetch current weather data: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getForecast(city: string): Promise<ForecastData> {
  try {
    const apiKey = getApiKey()
    if (!apiKey) {
      throw new Error("API key is missing")
    }

    const coords = CITY_COORDINATES[city as keyof typeof CITY_COORDINATES]

    if (!coords) {
      throw new Error(`Unknown city: ${city}`)
    }

    const url = `${BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`
    console.log("Fetching forecast from:", url.replace(apiKey, "API_KEY_HIDDEN"))

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    return response.json()
  } catch (error) {
    console.error("getForecast error:", error)
    throw new Error(`Failed to fetch forecast data: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function getWeatherIcon(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15)
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getUVIndexDescription(uvIndex: number): string {
  if (uvIndex <= 2) return "Low"
  if (uvIndex <= 5) return "Moderate"
  if (uvIndex <= 7) return "High"
  if (uvIndex <= 10) return "Very High"
  return "Extreme"
}

// Philippine cities
export const philippineCities = [
  { value: "manila", label: "Manila" },
  { value: "quezon-city", label: "Quezon City" },
  { value: "cebu", label: "Cebu City" },
  { value: "davao", label: "Davao City" },
  { value: "baguio", label: "Baguio City" },
  { value: "tagaytay", label: "Tagaytay" },
  { value: "boracay", label: "Boracay" },
  { value: "palawan", label: "Palawan" },
  { value: "iloilo", label: "Iloilo City" },
  { value: "batangas", label: "Batangas" },
]

// Weather condition mapping to icons
export function getWeatherIcon2(condition: string): React.ReactNode {
  const conditions: Record<string, string> = {
    Clear: "sun",
    Clouds: "cloud",
    Rain: "cloud-rain",
    Drizzle: "cloud-drizzle",
    Thunderstorm: "cloud-lightning",
    Snow: "cloud-snow",
    Mist: "cloud-fog",
    Smoke: "cloud-fog",
    Haze: "cloud-fog",
    Dust: "wind",
    Fog: "cloud-fog",
    Sand: "wind",
    Ash: "wind",
    Squall: "wind",
    Tornado: "wind",
  }

  return conditions[condition] || "cloud"
}


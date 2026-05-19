import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  location: string;
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Mock weather data by region/location as fallback
const mockWeatherData: Record<string, WeatherData> = {
  guntur: {
    temp: 28,
    condition: "Light Rain",
    humidity: 82,
    windSpeed: 12,
    rainfall: 16,
    location: "Guntur, Andhra Pradesh",
  },
  warangal: {
    temp: 31,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 10,
    rainfall: 5,
    location: "Warangal, Telangana",
  },
  nalgonda: {
    temp: 33,
    condition: "Sunny",
    humidity: 58,
    windSpeed: 15,
    rainfall: 0,
    location: "Nalgonda, Telangana",
  },
  khammam: {
    temp: 30,
    condition: "Cloudy",
    humidity: 70,
    windSpeed: 8,
    rainfall: 2,
    location: "Khammam, Telangana",
  },
};

export class WeatherService {
  static async getWeather(lat?: number, lon?: number, locationName?: string): Promise<WeatherData> {
    const key = locationName ? locationName.toLowerCase().split(",")[0].trim() : "guntur";
    const defaultFallback = mockWeatherData[key] || mockWeatherData.guntur;

    if (!OPENWEATHER_API_KEY) {
      console.log(`[WeatherService] No API key found. Using mock data for ${key}.`);
      return defaultFallback;
    }

    try {
      let url = "";
      if (lat !== undefined && lon !== undefined) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      } else if (locationName) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationName)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      } else {
        return defaultFallback;
      }

      console.log(`[WeatherService] Fetching live weather data from OpenWeatherMap...`);
      const response = await axios.get(url, { timeout: 5000 });
      const data = response.data;

      // Extract rainfall if present (rain.1h or rain.3h)
      let rainfall = 0;
      if (data.rain) {
        rainfall = data.rain["1h"] || data.rain["3h"] || 0;
      }

      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0]?.main || "Clear",
        humidity: data.main.humidity || 50,
        windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // m/s to km/h
        rainfall: rainfall,
        location: `${data.name}, ${data.sys?.country || ""}`,
      };
    } catch (error: any) {
      console.error(`[WeatherService] Error fetching weather data: ${error.message}. Falling back to mock data.`);
      return defaultFallback;
    }
  }
}

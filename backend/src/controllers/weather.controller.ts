import { Request, Response } from "express";
import prisma from "../db";
import { WeatherService } from "../services/weather.service";

export class WeatherController {
  /**
   * Retrieves live weather for a specific region.
   * If a region ID or location query is supplied, it queries OpenWeatherMap.
   */
  static async getWeather(req: Request, res: Response): Promise<void> {
    const { regionId, location } = req.query;

    try {
      let lat: number | undefined;
      let lon: number | undefined;
      let locName: string | undefined = location as string;

      if (regionId) {
        const region = await prisma.region.findUnique({
          where: { id: parseInt(regionId as string) },
        });

        if (region) {
          lat = region.latitude;
          lon = region.longitude;
          locName = `${region.name}, ${region.state}`;
        }
      }

      // Fetch dynamic live weather (with mock fallbacks)
      const weatherData = await WeatherService.getWeather(lat, lon, locName);

      // Optionally, update cache in the DB if region ID was used
      if (regionId && lat !== undefined && lon !== undefined) {
        await prisma.region.update({
          where: { id: parseInt(regionId as string) },
          data: {
            temp: weatherData.temp,
            humidity: weatherData.humidity,
            windSpeed: weatherData.windSpeed,
            rainfall: weatherData.rainfall,
          },
        });
      }

      res.status(200).json(weatherData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

import { Request, Response } from "express";
import prisma from "../db";

export class RegionController {
  /**
   * Retrieves all regions with details (Priority Regions list + Map markers).
   */
  static async getRegions(req: Request, res: Response): Promise<void> {
    try {
      const regions = await prisma.region.findMany({
        include: {
          recommendations: true,
        },
      });

      // Format data nicely for front-end consumption
      const formattedRegions = regions.map((region) => {
        // Calculate crop health percentage based on risk score
        const cropHealthPercent = Math.round(100 - region.riskScore * 0.4);

        return {
          id: region.id,
          name: region.name,
          state: region.state,
          cropType: region.cropType,
          riskScore: region.riskScore,
          pestRiskLevel: region.pestRiskLevel,
          cropHealth: `${cropHealthPercent}%`,
          coordinates: {
            lat: region.latitude,
            lng: region.longitude,
          },
          weather: {
            temp: region.temp ?? 30,
            humidity: region.humidity ?? 70,
            windSpeed: region.windSpeed ?? 10,
            rainfall: region.rainfall ?? 5,
          },
          hasFeaturedRecommendation: region.recommendations.some(r => r.isFeatured),
        };
      });

      res.status(200).json(formattedRegions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves details of a specific region by ID.
   */
  static async getRegionById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const region = await prisma.region.findUnique({
        where: { id: parseInt(id as string) },
        include: { recommendations: true },
      });

      if (!region) {
        res.status(404).json({ error: "Region not found" });
        return;
      }

      res.status(200).json(region);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

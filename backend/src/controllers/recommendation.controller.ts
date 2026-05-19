import { Request, Response } from "express";
import prisma from "../db";

export class RecommendationController {
  /**
   * Retrieves the current featured AI recommendation card data.
   */
  static async getFeatured(req: Request, res: Response): Promise<void> {
    try {
      const featuredRec = await prisma.recommendation.findFirst({
        where: { isFeatured: true },
        include: {
          region: true,
        },
      });

      if (!featuredRec) {
        res.status(404).json({ error: "No featured recommendation found." });
        return;
      }

      // Format response exactly as shown on the AI Recommendation card
      const responseData = {
        id: featuredRec.id,
        regionName: `${featuredRec.region.name}, ${featuredRec.region.state}`,
        priority: featuredRec.priority,
        action: featuredRec.action,
        product: featuredRec.product,
        reason: featuredRec.reason,
        benefit: featuredRec.benefit,
        confidence: featuredRec.confidence,
        crop: featuredRec.region.cropType,
        date: featuredRec.date,
      };

      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves the full table of recent recommendations.
   */
  static async getRecent(req: Request, res: Response): Promise<void> {
    try {
      const recommendations = await prisma.recommendation.findMany({
        include: {
          region: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      const formattedList = recommendations.map((rec) => ({
        id: rec.id,
        region: `${rec.region.name}, ${rec.region.state}`,
        crop: rec.region.cropType,
        recommendation: `${rec.action} (${rec.product})`,
        priority: rec.priority,
        date: rec.date,
        action: rec.action,
        product: rec.product,
        reason: rec.reason,
        benefit: rec.benefit,
        confidence: rec.confidence,
      }));

      res.status(200).json(formattedList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

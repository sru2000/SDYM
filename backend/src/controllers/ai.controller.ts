import { Request, Response } from "express";
import prisma from "../db";
import { AIService } from "../services/ai.service";
import { WeatherService } from "../services/weather.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export class AIController {
  /**
   * Handles interactive chat queries for the AI Assistant widget.
   */
  static async handleChat(req: Request, res: Response): Promise<void> {
    const { query, history } = req.body;

    if (!query) {
      res.status(400).json({ error: "Query is required." });
      return;
    }

    try {
      const chatHistory = history || [];
      const reply = await AIService.chat(query, chatHistory);
      res.status(200).json({ reply });
    } catch (error: unknown) {
      console.error("[AIController] Chat request failed:", getErrorMessage(error));
      res.status(500).json({
        error: "AI chat request failed.",
        code: "AI_CHAT_FAILED",
        details: getErrorMessage(error),
      });
    }
  }

  /**
   * Dynamically generates a fresh AI recommendation for a specific region
   * based on its current database metrics and live weather data.
   */
  static async generateRegionRecommendation(req: Request, res: Response): Promise<void> {
    const { regionId } = req.body;
    const parsedRegionId = Number.parseInt(String(regionId), 10);

    if (!regionId || Number.isNaN(parsedRegionId)) {
      res.status(400).json({
        error: "Region ID is required and must be a number.",
        code: "INVALID_REGION_ID",
      });
      return;
    }

    try {
      console.log("[AIController] Generate recommendation started", {
        regionId: parsedRegionId,
        hasGeminiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
      });

      console.log("[AIController] Loading region from database", { regionId: parsedRegionId });
      const region = await prisma.region.findUnique({
        where: { id: parsedRegionId },
      });

      if (!region) {
        console.warn("[AIController] Region not found", { regionId: parsedRegionId });
        res.status(404).json({
          error: "Region not found.",
          code: "REGION_NOT_FOUND",
          details: `No region exists with id ${parsedRegionId}. Run prisma db push and seed the local database.`,
        });
        return;
      }

      console.log("[AIController] Region loaded", {
        regionId: region.id,
        name: region.name,
        cropType: region.cropType,
        pestRiskLevel: region.pestRiskLevel,
      });

      // 1. Get live weather metrics
      console.log("[AIController] Loading weather data", { regionId: region.id });
      const weather = await WeatherService.getWeather(
        region.latitude,
        region.longitude,
        `${region.name}, ${region.state}`
      );

      // 2. Call Gemini service to generate agronomist-standard recommendation
      console.log("[AIController] Requesting AI recommendation", { regionId: region.id });
      const aiRec = await AIService.generateRecommendation(
        region.name,
        region.cropType,
        region.pestRiskLevel,
        region.riskScore,
        {
          temp: weather.temp,
          humidity: weather.humidity,
          wind: weather.windSpeed,
          rainfall: weather.rainfall,
        }
      );

      // 3. Mark all other recommendations for this region as not featured
      console.log("[AIController] Updating previous recommendations", { regionId: region.id });
      await prisma.recommendation.updateMany({
        where: { regionId: region.id },
        data: { isFeatured: false },
      });

      // 4. Create and save the new recommendation as the active featured one
      console.log("[AIController] Saving generated recommendation", { regionId: region.id });
      const newRec = await prisma.recommendation.create({
        data: {
          regionId: region.id,
          action: aiRec.action,
          product: aiRec.product,
          reason: aiRec.reason,
          benefit: aiRec.benefit,
          confidence: aiRec.confidence,
          priority: region.pestRiskLevel, // Align priority with region's risk
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          isFeatured: true,
        },
      });

      // 5. Update cached weather metrics in region table
      console.log("[AIController] Updating cached weather metrics", { regionId: region.id });
      await prisma.region.update({
        where: { id: region.id },
        data: {
          temp: weather.temp,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          rainfall: weather.rainfall,
        },
      });

      console.log("[AIController] Recommendation generated successfully", {
        regionId: region.id,
        recommendationId: newRec.id,
      });

      res.status(200).json({
        message: "Dynamic AI recommendation generated successfully!",
        recommendation: {
          id: newRec.id,
          regionName: `${region.name}, ${region.state}`,
          priority: newRec.priority,
          action: newRec.action,
          product: newRec.product,
          reason: newRec.reason,
          benefit: newRec.benefit,
          confidence: newRec.confidence,
          crop: region.cropType,
          date: newRec.date,
        },
      });
    } catch (error: unknown) {
      const details = getErrorMessage(error);
      console.error("[AIController] Recommendation generation failed:", details);
      res.status(500).json({
        error: "Failed to generate AI recommendation.",
        code: "AI_RECOMMENDATION_FAILED",
        details,
      });
    }
  }
}

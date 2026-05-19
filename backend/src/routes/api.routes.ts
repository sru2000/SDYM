import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { RegionController } from "../controllers/region.controller";
import { RecommendationController } from "../controllers/recommendation.controller";
import { WeatherController } from "../controllers/weather.controller";
import { AIController } from "../controllers/ai.controller";
import { AnalyticsController } from "../controllers/analytics.controller";
import mlRoutes from "./ml.routes";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { SettingsController } from "../controllers/settings.controller";


const router = Router();

// Authentication
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);
router.get("/auth/me", requireAuth, AuthController.me);

// User settings
router.get("/settings", requireAuth, SettingsController.getSettings);
router.put("/settings", requireAuth, SettingsController.updateSettings);

// Dashboard & KPIs
router.get("/dashboard/kpi", requireAuth, DashboardController.getKPIs);
router.get("/dashboard/sidebar-summary", requireAuth, DashboardController.getSidebarSummary);

// Regions & Mapping
router.get("/regions", RegionController.getRegions);
router.get("/regions/:id", RegionController.getRegionById);

// Recommendations
router.get("/recommendations/featured", requireAuth, RecommendationController.getFeatured);
router.get("/recommendations/recent", requireAuth, RecommendationController.getRecent);

// Weather
router.get("/weather", WeatherController.getWeather);

// Analytics & Charts
router.get("/analytics/crop-distribution", requireAuth, AnalyticsController.getCropDistribution);
router.get("/analytics/pest-trend", requireAuth, AnalyticsController.getPestTrends);

// AI Integration
router.post("/ai/chat", AIController.handleChat);
router.post("/ai/recommendation", AIController.generateRegionRecommendation);

// ML Routes
router.use("/ml", mlRoutes);

export default router;

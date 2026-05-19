// ml.routes.ts — KrishiMitra AI

import express from "express";
import { getPredictions, getOptimizedRoute } from "../controllers/ml.controller";

const router = express.Router();

// GET /api/ml/predictions — top retailers ranked by ML priority
router.get("/predictions", getPredictions);

// GET /api/ml/route — optimized visit route (ordered by travel distance)
router.get("/route", getOptimizedRoute);

export default router;

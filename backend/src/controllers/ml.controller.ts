// ml.controller.ts — KrishiMitra AI
//
// Fixes applied vs. original:
//   - fs.readFileSync → fs.promises (async, non-blocking)
//   - File reads delegated to ml.service.ts (proper separation of concerns)
//   - Both /predictions and /route endpoints included

import { Request, Response } from "express";
import * as mlService from "../services/ml.service";

export const getPredictions = async (req: Request, res: Response) => {
  try {
    const data = await mlService.getPredictions();
    res.json(data);
  } catch (error) {
    console.error("[ML] Failed to load predictions:", error);
    res.status(500).json({
      message: "Failed to fetch predictions. Ensure the ML pipeline has been run.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getOptimizedRoute = async (req: Request, res: Response) => {
  try {
    const data = await mlService.getOptimizedRoute();
    res.json(data);
  } catch (error) {
    console.error("[ML] Failed to load route:", error);
    res.status(500).json({
      message: "Failed to fetch optimized route. Ensure optimize_route.py has been run.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

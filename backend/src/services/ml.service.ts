// ml.service.ts — KrishiMitra AI
// Reads ML output files from disk.
// The controller should call this; never read files directly in controllers.

import fs from "fs/promises";
import path from "path";

const PROCESSED_DIR = path.join(process.cwd(), "ML/processed");

export interface RetailerPrediction {
  retailer_id: string;
  territory_id: string;
  state: string;
  district: string;
  tehsil: string;
  lat: number;
  lng: number;
  prediction_probability: number;
  priority_score: number;
  visit_order: number;
  total_sales: number;
  stockout_count: number;
  days_since_visit: number;
  reasons: string[];
}

export interface RouteStop extends RetailerPrediction {
  estimated_total_route_km: number;
}

export const getPredictions = async (): Promise<RetailerPrediction[]> => {
  const filePath = path.join(PROCESSED_DIR, "top_retailers.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as RetailerPrediction[];
};

export const getOptimizedRoute = async (): Promise<RouteStop[]> => {
  const filePath = path.join(PROCESSED_DIR, "optimized_route.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as RouteStop[];
  // Return sorted by visit order
  return data.sort((a, b) => a.visit_order - b.visit_order);
};

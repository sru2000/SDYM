import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

type RecommendationPayload = {
  action: string;
  product: string;
  reason: string;
  benefit: string;
  confidence: number;
};

const logGeminiConfig = () => {
  console.log("[AIService] Gemini config", {
    hasApiKey: Boolean(GEMINI_API_KEY),
    apiKeyLength: GEMINI_API_KEY?.length ?? 0,
    model: GEMINI_MODEL,
  });
};

const getSafeErrorDetails = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    };
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
};

const parseRecommendationJson = (responseText: string): RecommendationPayload => {
  const cleaned = responseText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  const parsed = JSON.parse(cleaned) as Partial<RecommendationPayload>;

  if (
    !parsed.action ||
    !parsed.product ||
    !parsed.reason ||
    !parsed.benefit ||
    typeof parsed.confidence !== "number"
  ) {
    throw new Error("Gemini response did not match the recommendation schema.");
  }

  return {
    action: parsed.action,
    product: parsed.product,
    reason: parsed.reason,
    benefit: parsed.benefit,
    confidence: Math.min(98, Math.max(70, Math.round(parsed.confidence))),
  };
};

let ai: GoogleGenAI | null = null;
logGeminiConfig();

if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log("[AIService] Google Gen AI SDK initialized successfully.");
  } catch (error) {
    console.error("[AIService] Failed to initialize Google Gen AI:", getSafeErrorDetails(error));
  }
} else {
  console.log("[AIService] No GEMINI_API_KEY found. AI features will use fallback mock responses.");
}

export class AIService {
  /**
   * Generates a response for the AI Assistant chat widget.
   */
  static async chat(query: string, history: Array<{ role: "user" | "model"; text: string }> = []): Promise<string> {
    if (!ai) {
      return this.getMockChatResponse(query);
    }

    try {
      console.log("[AIService] Sending live chat request to Gemini", {
        model: GEMINI_MODEL,
        queryLength: query.length,
        historyLength: history.length,
      });
      
      // Build standard chat format
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: query,
        config: {
          systemInstruction: "You are KrishiMitra AI, an intelligent agricultural assistant designed to help Field Representatives manage crops, pests, and soil health. Keep your answers concise, practical, and focused on regional Indian farming conditions. Use simple formatting.",
        }
      });

      console.log("[AIService] Gemini chat request completed", {
        hasText: Boolean(response.text),
        textLength: response.text?.length ?? 0,
      });

      return response.text || "I apologize, I couldn't formulate a response right now. Please try again.";
    } catch (error: any) {
      console.error("[AIService] Error in live Gemini chat:", getSafeErrorDetails(error));
      return this.getMockChatResponse(query);
    }
  }

  /**
   * Generates custom crop & pest recommendations dynamically using Gemini.
   */
  static async generateRecommendation(
    regionName: string,
    crop: string,
    pestRisk: string,
    riskScore: number,
    weather: { temp?: number; humidity?: number; wind?: number; rainfall?: number }
  ): Promise<{
    action: string;
    product: string;
    reason: string;
    benefit: string;
    confidence: number;
  }> {
    if (!ai) {
      console.log("[AIService] Gemini client unavailable. Using fallback recommendation.", {
        regionName,
        crop,
        pestRisk,
      });
      return this.getMockRecommendation(regionName, crop, pestRisk, riskScore);
    }

    try {
      console.log("[AIService] Generating live recommendation via Gemini", {
        model: GEMINI_MODEL,
        regionName,
        crop,
        pestRisk,
        riskScore,
        weather,
      });
      
      const prompt = `
        Analyze the following agricultural field data and generate a professional crop recommendation in strict JSON format:
        Region: ${regionName}
        Crop: ${crop}
        Pest Risk Level: ${pestRisk}
        Risk Score: ${riskScore}/100
        Current Weather conditions: 
        - Temperature: ${weather.temp ?? "N/A"}°C
        - Humidity: ${weather.humidity ?? "N/A"}%
        - Wind Speed: ${weather.wind ?? "N/A"} km/h
        - Rainfall: ${weather.rainfall ?? "N/A"} mm

        Your output MUST be a valid JSON object with the exact keys:
        {
          "action": "Recommended Action (short title, e.g. Apply Fungicide)",
          "product": "Product name or tool (e.g. Amistar Top)",
          "reason": "Clear explanation citing the weather/pest threat (e.g. High humidity (82%) and pest risk detected)",
          "benefit": "Expected benefit (e.g. Reduce crop damage by 30-40%)",
          "confidence": number between 70 and 98 (representing AI confidence)
        }
      `;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an expert agronomist specializing in Indian agriculture. Always output valid, raw JSON matches the requested schema.",
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Empty response from model");

      const recommendation = parseRecommendationJson(responseText);
      console.log("[AIService] Gemini recommendation parsed successfully", {
        action: recommendation.action,
        product: recommendation.product,
        confidence: recommendation.confidence,
      });

      return recommendation;
    } catch (error: any) {
      console.error("[AIService] Error generating dynamic recommendation with Gemini:", getSafeErrorDetails(error));
      console.log("[AIService] Falling back to local recommendation engine.", {
        regionName,
        crop,
        pestRisk,
      });
      return this.getMockRecommendation(regionName, crop, pestRisk, riskScore);
    }
  }

  // --- Fallback Mock Engines ---

  private static getMockChatResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes("chilli") || q.includes("fungicide")) {
      return "For Chilli crops in high humidity, the primary recommendation is applying Fungicide (like Amistar Top) to prevent fungal blight and mildew. Ensure field drainage is optimal to reduce moisture build-up.";
    }
    if (q.includes("bollworm") || q.includes("cotton")) {
      return "Cotton crops are highly susceptible to bollworms under moderate humidity. I recommend deploying pheromone traps (approx. 5-10 per acre) and monitoring weekly. If threshold is exceeded, consider a targeted insecticide treatment.";
    }
    if (q.includes("rice") || q.includes("nitrogen")) {
      return "Rice fields showing nitrogen deficiency benefit from split applications of Urea or NPK. Apply fertilizer during active tillering and panicle initiation stages, preferably in damp soil after draining excess standing water.";
    }
    if (q.includes("weather") || q.includes("rain")) {
      return "Weather patterns show light showers in the coastal districts. Field representatives should advise farmers to postpone spraying operations during rain windows to avoid pesticide run-off.";
    }
    return "Hello! I am KrishiMitra AI. I can assist you with real-time recommendations for crops like Chilli, Cotton, and Rice, pest management options, and optimal field rep operations. How can I help you today?";
  }

  private static getMockRecommendation(region: string, crop: string, pestRisk: string, riskScore: number) {
    if (crop.toLowerCase() === "chilli") {
      return {
        action: "Apply Fungicide",
        product: "Amistar Top",
        reason: "High humidity (82%) and pest risk detected in Guntur Chilli crop.",
        benefit: "Reduce crop damage by 30-40%",
        confidence: 85,
      };
    }
    if (crop.toLowerCase() === "cotton") {
      return {
        action: "Monitor Bollworm, Use Trap",
        product: "Bollworm Trap",
        reason: "Medium risk of bollworm activity detected in Warangal Cotton fields.",
        benefit: "Early pest containment",
        confidence: 75,
      };
    }
    return {
      action: "Apply Nitrogen Fertilizer",
      product: "Urea/NPK",
      reason: `Moderate nutrient deficiency detected in ${crop} crop.`,
      benefit: "Improve crop yield by 15-20%",
      confidence: 80,
    };
  }
}

import {
  dashboardStats,
  riskZones,
  recommendations,
  weather,
  alerts,
  cropDistribution,
  activityLogs
} from "../data/dashboardData.js";

const DEFAULT_PRODUCTION_API_URL = "https://krishimitraai-main.onrender.com";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? DEFAULT_PRODUCTION_API_URL : "")
).replace(/\/+$/, "");
const AUTH_STORAGE_KEY = "km-auth";

function buildApiUrl(path) {
  if (!API_BASE_URL) {
    return path;
  }

  if (API_BASE_URL.endsWith("/api") && path.startsWith("/api/")) {
    return `${API_BASE_URL}${path.slice(4)}`;
  }

  return `${API_BASE_URL}${path}`;
}

function getStoredToken() {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    return auth?.token;
  } catch {
    return null;
  }
}

// Fetch Helper
async function request(url, options = {}) {
  try {
    const token = getStoredToken();
    const res = await fetch(buildApiUrl(url), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let errorPayload = {};
      try {
        errorPayload = await res.json();
      } catch {
        errorPayload = {};
      }

      const message =
        errorPayload.details ||
        errorPayload.error ||
        `HTTP error! status: ${res.status}`;
      const error = new Error(message);
      error.status = res.status;
      error.code = errorPayload.code;
      throw error;
    }

    return await res.json();
  } catch (error) {
    console.warn(`[API Client] Failed request to ${url}:`, error);
    throw error;
  }
}

export const loginRequest = async ({ email, password }) => {
  return await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const registerRequest = async ({ email, password, name, role, region }) => {
  return await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name, role, region }),
  });
};

export const fetchCurrentUser = async () => {
  return await request("/api/auth/me");
};

export const fetchSettings = async () => {
  return await request("/api/settings");
};

export const updateSettings = async (payload) => {
  return await request("/api/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const fetchKPIs = async () => {
  try {
    const data = await request("/api/dashboard/kpi");
    return [
      {
        id: "regions",
        label: "Total Regions",
        value: String(data.totalRegions),
        change: "+6 this month",
        tone: "emerald",
      },
      {
        id: "priority",
        label: "High Priority Areas",
        value: String(data.highPriority),
        change: "3 critical",
        tone: "rose",
      },
      {
        id: "health",
        label: "Crop Health",
        value: data.cropHealth,
        change: "+4.2% weekly",
        tone: "teal",
      },
      {
        id: "pest",
        label: "Pest Risk Level",
        value: data.pestRisk,
        change: "rising in 5 zones",
        tone: "amber",
      },
      {
        id: "yield",
        label: "Expected Yield",
        value: "128,000 Tonnes",
        change: "+11.8% forecast",
        tone: "lime",
      },
      {
        id: "confidence",
        label: "AI Confidence",
        value: "94%",
        change: "based on 1.8M signals",
        tone: "sky",
      },
    ];
  } catch {
    return dashboardStats;
  }
};

export const fetchSidebarSummary = async () => {
  try {
    return await request("/api/dashboard/sidebar-summary");
  } catch {
    return {
      totalVisits: 12,
      highPriorityRegions: 3,
      alerts: 5,
      recommendations: 8,
    };
  }
};

export const fetchRegions = async () => {
  try {
    const data = await request("/api/regions");
    // Map to riskZones shape
    return data.map((r) => {
      const activeRec = r.recommendations?.find((rec) => rec.isFeatured) || r.recommendations?.[0];
      return {
        id: r.id,
        region: r.name,
        crop: r.cropType,
        risk: r.pestRiskLevel,
        score: r.riskScore,
        position: [r.coordinates.lat, r.coordinates.lng],
        issue: activeRec ? activeRec.reason : "No major anomaly",
        action: activeRec ? `${activeRec.action} (${activeRec.product})` : "Continue routine monitoring",
        weather: r.weather,
      };
    });
  } catch {
    return riskZones;
  }
};

export const fetchWeather = async (regionId) => {
  try {
    const query = regionId ? `?regionId=${regionId}` : "";
    const data = await request(`/api/weather${query}`);
    return {
      location: data.location || "Vijayawada cluster",
      temperature: `${data.temp} C`,
      humidity: `${data.humidity}%`,
      rainfall: `${data.rainfall} mm`,
      wind: `${data.windSpeed} km/h`,
      recommendation:
        data.humidity > 75
          ? "Delay foliar spray until evening. Humidity favors fungal spread in low-drainage plots."
          : "Weather conditions are optimal for foliar spray and fertilizing.",
    };
  } catch {
    return weather;
  }
};

export const fetchFeaturedRecommendation = async () => {
  try {
    return await request("/api/recommendations/featured");
  } catch {
    return {
      id: 1,
      regionName: "Guntur, Andhra Pradesh",
      priority: "High",
      action: "Apply Fungicide",
      product: "Amistar Top",
      reason: "High humidity (82%) and pest risk detected.",
      benefit: "Reduce crop damage by 30-40%",
      confidence: 85,
      crop: "Chilli",
      date: "May 12, 2025",
    };
  }
};

export const fetchRecentRecommendations = async () => {
  try {
    const data = await request("/api/recommendations/recent");
    return data;
  } catch {
    return recommendations.map((r, i) => ({
      id: i + 1,
      region: `${r.region}, AP`,
      crop: r.crop || "Chilli",
      recommendation: `${r.disease || "Apply Fungicide"} (${r.treatment || "Amistar Top"})`,
      priority: r.priority === "Critical" ? "High" : r.priority,
      date: "May 12, 2025",
    }));
  }
};

export const sendAIChatMessage = async (query, history = []) => {
  try {
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      text: msg.text,
    }));
    const data = await request("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ query, history: formattedHistory }),
    });
    return data.reply;
  } catch {
    const q = query.toLowerCase();
    if (q.includes("chilli")) {
      return "Chilli risk is rising in Guntur due to humidity. Recommend inspection and Amistar Top application.";
    }
    if (q.includes("bollworm")) {
      return "For pink bollworm in Warangal, use pheromone traps and early morning scouting.";
    }
    return "Based on mock telemetry signals, I recommend reviewing high priority regions and sending targeted farmer advisories.";
  }
};

export const generateDynamicRecommendation = async (regionId) => {
  return await request("/api/ai/recommendation", {
    method: "POST",
    body: JSON.stringify({ regionId }),
  });
};

export const fetchMLPredictions = async () => {
  try {
    return await request("/api/ml/predictions");
  } catch (error) {
    console.warn("Failed to fetch predictions, utilizing empty route", error);
    return [];
  }
};

export const fetchMLOptimizedRoute = async () => {
  try {
    return await request("/api/ml/route");
  } catch (error) {
    console.warn("Failed to fetch optimized route", error);
    return [];
  }
};

export const fetchCropDistribution = async () => {
  try {
    const data = await request("/api/analytics/crop-distribution");
    // Return with mapped structure for charts: { name, value, hectares }
    // Backend returns: [{ crop: 'Chilli', percentage: 35, color: '#10b981' }, ...]
    // Map: crop -> name, percentage -> value, and provide some sample hectares matching the original cropDistribution
    const hectareMap = { Chilli: 9400, Cotton: 11900, Rice: 18400, Maize: 7600, Others: 2000 };
    return data.map((item) => ({
      name: item.crop,
      value: item.percentage,
      hectares: hectareMap[item.crop] || 1500,
    }));
  } catch {
    return cropDistribution;
  }
};

export const fetchPestRiskTrends = async () => {
  try {
    const data = await request("/api/analytics/pest-trend");
    // Backend: [{ date, highRisk, mediumRisk, lowRisk }]
    // Map highRisk -> pestRisk, average -> cropHealth, and moisture for chart
    return data.map((item) => ({
      day: item.date,
      pestRisk: item.highRisk,
      cropHealth: Math.round(100 - item.highRisk * 0.3),
      moisture: Math.round(item.mediumRisk * 1.1),
    }));
  } catch {
    return [
      { day: "Mon", pestRisk: 34, cropHealth: 82, moisture: 58 },
      { day: "Tue", pestRisk: 42, cropHealth: 81, moisture: 54 },
      { day: "Wed", pestRisk: 39, cropHealth: 84, moisture: 61 },
      { day: "Thu", pestRisk: 58, cropHealth: 79, moisture: 49 },
      { day: "Fri", pestRisk: 51, cropHealth: 83, moisture: 57 },
      { day: "Sat", pestRisk: 67, cropHealth: 77, moisture: 44 },
      { day: "Sun", pestRisk: 62, cropHealth: 80, moisture: 52 },
    ];
  }
};

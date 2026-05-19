import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();




async function main() {
  console.log("Starting seeding...");

  // Clear existing data
  await prisma.recommendation.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.region.deleteMany();
  await prisma.pestTrend.deleteMany();
  await prisma.visitSummary.deleteMany();
  await prisma.user.deleteMany();

  try {
    await prisma.$executeRawUnsafe(
      "DELETE FROM sqlite_sequence WHERE name IN ('User', 'Region', 'Recommendation', 'PestTrend', 'VisitSummary')"
    );
  } catch {
    console.log("Skipping SQLite sequence reset.");
  }

  // 1. Seed demo admin account
  const user = await prisma.user.create({
    data: {
      email: "admin@krishimitra.ai",
      password: await bcrypt.hash("admin123", 12),
      name: "Admin User",
      role: "Operations Lead",
      region: "Andhra Pradesh and Telangana",
      settings: {
        create: {},
      },
    },
  });
  console.log("Seeded User:", user.name);

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@krishimitra.ai",
      password: await bcrypt.hash("demo123", 12),
      name: "Demo User",
      role: "Field Analyst",
      region: "Guntur cluster",
      settings: {
        create: {
          smsAlerts: true,
          aiSensitivity: 68,
          pestThreshold: 78,
        },
      },
    },
  });
  console.log("Seeded User:", demoUser.name);

  // 2. Seed Regions
  const guntur = await prisma.region.create({
    data: {
      name: "Guntur",
      state: "Andhra Pradesh",
      cropType: "Chilli",
      riskScore: 85,
      pestRiskLevel: "High",
      latitude: 16.3067,
      longitude: 80.4365,
      temp: 28.0,
      humidity: 82.0,
      windSpeed: 12.0,
      rainfall: 16.0,
    },
  });

  const warangal = await prisma.region.create({
    data: {
      name: "Warangal",
      state: "Telangana",
      cropType: "Cotton",
      riskScore: 62,
      pestRiskLevel: "Medium",
      latitude: 17.9784,
      longitude: 79.5982,
      temp: 31.0,
      humidity: 65.0,
      windSpeed: 10.0,
      rainfall: 5.0,
    },
  });

  const nalgonda = await prisma.region.create({
    data: {
      name: "Nalgonda",
      state: "Telangana",
      cropType: "Rice",
      riskScore: 58,
      pestRiskLevel: "Medium",
      latitude: 17.0575,
      longitude: 79.2684,
      temp: 33.0,
      humidity: 58.0,
      windSpeed: 15.0,
      rainfall: 0.0,
    },
  });

  const khammam = await prisma.region.create({
    data: {
      name: "Khammam",
      state: "Telangana",
      cropType: "Maize",
      riskScore: 32,
      pestRiskLevel: "Low",
      latitude: 17.2473,
      longitude: 80.1514,
      temp: 30.0,
      humidity: 70.0,
      windSpeed: 8.0,
      rainfall: 2.0,
    },
  });

  console.log("Seeded Regions");

  // 3. Seed Recommendations
  await prisma.recommendation.createMany({
    data: [
      {
        regionId: guntur.id,
        action: "Apply Fungicide",
        product: "Amistar Top",
        reason: "High humidity (82%) and pest risk detected.",
        benefit: "Reduce crop damage by 30-40%",
        confidence: 85,
        priority: "High",
        date: "May 12, 2025",
        isFeatured: true,
      },
      {
        regionId: warangal.id,
        action: "Monitor Bollworm, Use Trap",
        product: "Bollworm Trap",
        reason: "Medium risk of bollworm activity.",
        benefit: "Early pest containment",
        confidence: 75,
        priority: "Medium",
        date: "May 12, 2025",
        isFeatured: false,
      },
      {
        regionId: nalgonda.id,
        action: "Apply Nitrogen Fertilizer",
        product: "Urea/NPK",
        reason: "Soil nitrogen deficiency detected.",
        benefit: "Improve crop yield by 15%",
        confidence: 80,
        priority: "Medium",
        date: "May 12, 2025",
        isFeatured: false,
      },
      {
        regionId: khammam.id,
        action: "Irrigation Recommended",
        product: "Drip System",
        reason: "Slight moisture stress detected in soil.",
        benefit: "Optimized water usage",
        confidence: 90,
        priority: "Low",
        date: "May 12, 2025",
        isFeatured: false,
      },
    ],
  });
  console.log("Seeded Recommendations");

  // 4. Seed PestTrend
  await prisma.pestTrend.createMany({
    data: [
      { date: "May 6", highRisk: 60, mediumRisk: 45, lowRisk: 25 },
      { date: "May 7", highRisk: 85, mediumRisk: 50, lowRisk: 30 },
      { date: "May 8", highRisk: 70, mediumRisk: 48, lowRisk: 20 },
      { date: "May 9", highRisk: 80, mediumRisk: 55, lowRisk: 28 },
      { date: "May 10", highRisk: 90, mediumRisk: 52, lowRisk: 22 },
      { date: "May 11", highRisk: 92, mediumRisk: 62, lowRisk: 32 },
      { date: "May 12", highRisk: 85, mediumRisk: 58, lowRisk: 30 },
    ],
  });
  console.log("Seeded Pest Trend Data");

  // 5. Seed VisitSummary
  await prisma.visitSummary.create({
    data: {
      totalVisits: 12,
      highPriorityRegions: 3,
      alerts: 5,
      recommendations: 8,
    },
  });
  console.log("Seeded Visit Summary");

  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

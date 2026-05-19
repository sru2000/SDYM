import { Response } from "express";
import prisma from "../db";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const DEFAULT_SETTINGS = {
  emailAlerts: true,
  smsAlerts: false,
  autoEscalation: true,
  aiSensitivity: 72,
  pestThreshold: 82,
  rainfallThreshold: 64,
  firebaseProjectId: "krishimitra-ai-prod",
  predictionApiEndpoint: "",
  weatherProviderKey: "",
};

function clampPercent(value: unknown, fallback: number) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function sanitizeSettings(settings: typeof DEFAULT_SETTINGS & { id?: number; userId?: number }) {
  return {
    emailAlerts: settings.emailAlerts,
    smsAlerts: settings.smsAlerts,
    autoEscalation: settings.autoEscalation,
    aiSensitivity: settings.aiSensitivity,
    pestThreshold: settings.pestThreshold,
    rainfallThreshold: settings.rainfallThreshold,
    firebaseProjectId: settings.firebaseProjectId,
    predictionApiEndpoint: settings.predictionApiEndpoint,
    weatherProviderKey: settings.weatherProviderKey,
  };
}

export class SettingsController {
  static async getSettings(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const settings = await prisma.settings.upsert({
      where: { userId: req.user.id },
      update: {},
      create: {
        userId: req.user.id,
        ...DEFAULT_SETTINGS,
      },
    });

    return res.json({
      user: req.user,
      settings: sanitizeSettings(settings),
    });
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const { profile = {}, notifications = {}, thresholds = {}, integrations = {} } = req.body;
    const email = String(profile.email || req.user.email).trim().toLowerCase();
    const name = String(profile.name || req.user.name).trim();
    const role = String(profile.role || req.user.role).trim();
    const region = String(profile.region || req.user.region).trim();

    if (!name || !email || !role || !region) {
      return res.status(400).json({ error: "Profile name, email, role, and region are required." });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: req.user.id },
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Another user already uses that email." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, role, region },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        region: true,
        createdAt: true,
      },
    });

    const existingSettings = await prisma.settings.findUnique({
      where: { userId: req.user.id },
    });

    const fallback = existingSettings || DEFAULT_SETTINGS;
    const settings = await prisma.settings.upsert({
      where: { userId: req.user.id },
      update: {
        emailAlerts: notifications.emailAlerts ?? fallback.emailAlerts,
        smsAlerts: notifications.smsAlerts ?? fallback.smsAlerts,
        autoEscalation: notifications.autoEscalation ?? fallback.autoEscalation,
        aiSensitivity: clampPercent(thresholds.aiSensitivity, fallback.aiSensitivity),
        pestThreshold: clampPercent(thresholds.pestThreshold, fallback.pestThreshold),
        rainfallThreshold: clampPercent(
          thresholds.rainfallThreshold,
          fallback.rainfallThreshold,
        ),
        firebaseProjectId: String(integrations.firebaseProjectId ?? fallback.firebaseProjectId),
        predictionApiEndpoint: String(
          integrations.predictionApiEndpoint ?? fallback.predictionApiEndpoint,
        ),
        weatherProviderKey: String(
          integrations.weatherProviderKey ?? fallback.weatherProviderKey,
        ),
      },
      create: {
        userId: req.user.id,
        emailAlerts: notifications.emailAlerts ?? DEFAULT_SETTINGS.emailAlerts,
        smsAlerts: notifications.smsAlerts ?? DEFAULT_SETTINGS.smsAlerts,
        autoEscalation: notifications.autoEscalation ?? DEFAULT_SETTINGS.autoEscalation,
        aiSensitivity: clampPercent(thresholds.aiSensitivity, DEFAULT_SETTINGS.aiSensitivity),
        pestThreshold: clampPercent(thresholds.pestThreshold, DEFAULT_SETTINGS.pestThreshold),
        rainfallThreshold: clampPercent(
          thresholds.rainfallThreshold,
          DEFAULT_SETTINGS.rainfallThreshold,
        ),
        firebaseProjectId: String(
          integrations.firebaseProjectId ?? DEFAULT_SETTINGS.firebaseProjectId,
        ),
        predictionApiEndpoint: String(
          integrations.predictionApiEndpoint ?? DEFAULT_SETTINGS.predictionApiEndpoint,
        ),
        weatherProviderKey: String(
          integrations.weatherProviderKey ?? DEFAULT_SETTINGS.weatherProviderKey,
        ),
      },
    });

    return res.json({
      user: updatedUser,
      settings: sanitizeSettings(settings),
    });
  }
}

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../db";
import { createToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const BCRYPT_ROUNDS = 12;

function sanitizeUser(user: {
  id: number;
  email: string;
  name: string;
  role: string;
  region: string;
  createdAt?: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    region: user.region,
    createdAt: user.createdAt,
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password, name, role, region } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required." });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: await bcrypt.hash(String(password), BCRYPT_ROUNDS),
        name: String(name).trim(),
        role: role ? String(role).trim() : "Operations Lead",
        region: region ? String(region).trim() : "Andhra Pradesh and Telangana",
        settings: {
          create: {},
        },
      },
    });

    const token = createToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      region: user.region,
    });

    return res.status(201).json({ user: sanitizeUser(user), token });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = createToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      region: user.region,
    });

    return res.json({ user: sanitizeUser(user), token });
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    return res.json({ user: req.user });
  }
}

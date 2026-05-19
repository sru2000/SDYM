import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { verifyToken } from "../utils/jwt";

export type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
    region: string;
    createdAt?: Date;
  };
};

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        region: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

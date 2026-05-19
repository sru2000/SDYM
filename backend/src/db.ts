import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ||= "file:./dev.db";

const prisma = new PrismaClient();

export default prisma;

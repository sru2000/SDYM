import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.routes";
import prisma from "./db";

// Load environment variables
dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Enable CORS so the React frontend and deployed clients can query this server
app.use(
  cors({
    origin: "*", // Adjust to your deployed frontend origin for tighter security if needed
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register API Routes
app.use("/api", apiRoutes);

// Root route check
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "Welcome to KrishiMitra AI backend API. Access endpoints via /api",
    timestamp: new Date(),
  });
});

// Global 404 Route
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[ServerError]:", err);
  res.status(500).json({
    error: "An internal server error occurred.",
    message: err.message,
  });
});

// Start Server
const server = app.listen(Number(PORT), HOST, () => {
  console.log(`========================================`);
  console.log(`  KrishiMitra AI Backend running!`);
  console.log(`  Listening on: http://${HOST}:${PORT}`);
  console.log(`  CORS enabled for all origins`);
  console.log(`========================================`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  console.error("[ServerStartupError]:", {
    code: error.code,
    message: error.message,
    host: HOST,
    port: PORT,
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down server gracefully...");
  await prisma.$disconnect();
  console.log("Disconnected from database.");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down server gracefully...");
  await prisma.$disconnect();
  console.log("Disconnected from database.");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

export default app;

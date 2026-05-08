import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";

// Load .env only in non-production (Render injects env vars directly)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

const app = express();

// CORS — allow frontend origin from env, fallback to all in dev
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check — Render uses this to verify the service is up
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ msg: "Blog API running" });
});

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ msg: "Internal server error" });
});

const PORT = parseInt(process.env.PORT || "5000", 10);

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`)
  );
});

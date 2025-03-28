import express, { type Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import fs from "fs";

// Avoid any imports from vite.ts or similar development dependencies
// This file is used in production only

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Starting Sacred Computing Platform API in production mode");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Serve static files
const distPath = path.resolve(__dirname, "../public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // fall through to index.html if the file doesn't exist
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Initialize API routes and start server
(async () => {
  try {
    const server = await registerRoutes(app);
    
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    server.listen(port, "0.0.0.0", () => {
      console.log(`Sacred Computing Platform API running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
import dotenv from "dotenv";
dotenv.config();  // ✅ Load environment variables FIRST before anything else

import express, { Application, Request, Response } from "express";
import routes from "./routes/index";
import helmetMiddleware from "./middlewares/helmetMiddleware";
import corsMiddleware from "./middlewares/corsMiddleware";
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware";
import logMiddleware from "./middlewares/logMiddelware";
import logger from "./utils/logger";

// ✅ Initialize Express before using `app`
const app: Application = express();

// ✅ Now it's safe to set proxy
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(logMiddleware);

// API Routes
app.use("/api", routes);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("RSVPMe Backend with TypeScript is running!");
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: Function) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Export app after everything is declared
export default app;

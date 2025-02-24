import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database"; // Assuming this is a file for DB connection
import routes from "./routes/index"; // This imports the consolidated routes from index.ts

// Import middlewares
import helmetMiddleware from "./middlewares/helmetMiddleware";
import corsMiddleware from "./middlewares/corsMiddleware";
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware";
import logMiddleware from "./middlewares/logMiddelware";
import logger from "./utils/logger";

// Load environment variables
dotenv.config();

// Initialize Express
const app: Application = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Apply middlewares
app.use(helmetMiddleware);  // Security middleware
app.use(corsMiddleware);    // CORS handling
app.use(rateLimitMiddleware); // Rate limiting middleware
app.use(logMiddleware); 

// Database connection
connectDB();

// Consolidated routes under "/api"
app.use("/api", routes);  // All routes defined in the "routes" folder will be accessible under /api

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("RSVPMe Backend with TypeScript is running!");
});

app.use((err: any, req: Request, res: Response, next: Function) => {
  logger.error(`Error: ${err.message}`);  // Log the error message
  res.status(500).json({ message: "Internal Server Error" });  // Send a response to the client
});

export default app;
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import routes from "./routes";

// Load environment variables
dotenv.config();

// Initialize Express
const app: Application = express();

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Consolidated routes under "/api"
app.use("/api", routes);  

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("RSVPMe Backend with TypeScript is running!");
});

export default app;
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const corsMiddleware = cors({
  origin: process.env.CORS_ALLOWED_ORIGINS?.split(",") || "*",  
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database")); // Assuming this is a file for DB connection
const routes_1 = __importDefault(require("./routes")); // This imports the consolidated routes from index.ts
// Import middlewares
const helmetMiddleware_1 = __importDefault(require("./middlewares/helmetMiddleware"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const rateLimitMiddleware_1 = __importDefault(require("./middlewares/rateLimitMiddleware"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // Parse incoming JSON requests
// Apply middlewares
app.use(helmetMiddleware_1.default); // Security middleware
app.use(corsMiddleware_1.default); // CORS handling
app.use(rateLimitMiddleware_1.default); // Rate limiting middleware
// Database connection
(0, database_1.default)();
// Consolidated routes under "/api"
app.use("/api", routes_1.default); // All routes defined in the "routes" folder will be accessible under /api
// Test route
app.get("/", (req, res) => {
    res.send("RSVPMe Backend with TypeScript is running!");
});
exports.default = app;

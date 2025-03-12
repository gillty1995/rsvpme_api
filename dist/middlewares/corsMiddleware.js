"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const corsMiddleware = (0, cors_1.default)({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});
exports.default = corsMiddleware;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Load environment variables FIRST before anything else
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const helmetMiddleware_1 = __importDefault(require("./middlewares/helmetMiddleware"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const rateLimitMiddleware_1 = __importDefault(require("./middlewares/rateLimitMiddleware"));
const logMiddelware_1 = __importDefault(require("./middlewares/logMiddelware"));
const logger_1 = __importDefault(require("./utils/logger"));
// ✅ Initialize Express before using `app`
const app = (0, express_1.default)();
// ✅ Now it's safe to set proxy
app.set("trust proxy", 1);
// Middleware
app.use(express_1.default.json());
app.use(helmetMiddleware_1.default);
app.use(corsMiddleware_1.default);
app.use(rateLimitMiddleware_1.default);
app.use(logMiddelware_1.default);
// API Routes
app.use("/api", index_1.default);
// Test route
app.get("/", (req, res) => {
    res.send("RSVPMe Backend with TypeScript is running!");
});
// Global Error Handler
app.use((err, req, res, next) => {
    logger_1.default.error(`Error: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
});
// ✅ Export app after everything is declared
exports.default = app;

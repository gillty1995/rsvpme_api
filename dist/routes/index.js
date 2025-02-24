"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes")); // Assuming you have user-related routes
const eventRoutes_1 = __importDefault(require("./eventRoutes")); // Import the event routes
const router = (0, express_1.Router)();
// User Routes
router.use("/users", userRoutes_1.default);
// Event Routes
router.use("/events", eventRoutes_1.default); // Integrating event routes under /events
exports.default = router;

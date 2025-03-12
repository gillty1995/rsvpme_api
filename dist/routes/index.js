"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const eventRoutes_1 = __importDefault(require("./eventRoutes"));
const rsvpRoutes_1 = __importDefault(require("./rsvpRoutes"));
const contactRoutes_1 = __importDefault(require("./contactRoutes"));
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const placesRoutes_1 = __importDefault(require("./placesRoutes"));
const router = (0, express_1.Router)();
// User Routes
router.use("/users", userRoutes_1.default);
// Event Routes
router.use("/events", eventRoutes_1.default);
// Rsvp Routes ... may need to be removed if not used
router.use("/rsvps", rsvpRoutes_1.default);
// Contact Routes
router.use("/", contactRoutes_1.default);
// Chat Routes
router.use("/chat", chatRoutes_1.default);
// Places API Routes (Google Maps)
router.use("/places", placesRoutes_1.default);
exports.default = router;

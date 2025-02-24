"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController"); // Assuming this is the correct path
const rsvpController_1 = require("../controllers/rsvpController"); // RSVP routes
const router = (0, express_1.Router)();
// Event Routes
router.post("/", eventController_1.createEvent); // Route to create an event
router.get("/:eventId", eventController_1.getEventById); // Route to get an event by eventId
// RSVP Routes
router.post("/:eventId/rsvp", rsvpController_1.rsvpToEvent); // Route for RSVP to an event
router.delete("/:eventId/rsvp", rsvpController_1.cancelRsvp); // Route to cancel RSVP
exports.default = router;

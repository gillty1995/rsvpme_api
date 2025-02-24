"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rsvpController_1 = require("../controllers/rsvpController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Assuming you have a middleware to verify JWT
const router = (0, express_1.Router)();
// RSVP to an event
// This route allows a user to RSVP to an event by providing the eventId in the URL
// The user must be authenticated to perform this action, which is enforced by the verifyJWT middleware
router.post("/events/:eventId/rsvp", authMiddleware_1.verifyJWT, rsvpController_1.rsvpToEvent);
// Cancel RSVP for an event
// This route allows a user to cancel their RSVP to an event by providing the eventId in the URL
// The user must be authenticated to perform this action, which is also enforced by the verifyJWT middleware
router.delete("/events/:eventId/rsvp", authMiddleware_1.verifyJWT, rsvpController_1.cancelRsvp);
exports.default = router;

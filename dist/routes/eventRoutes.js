"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
// import { rsvpToEvent, } from "../controllers/rsvpController"; 
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => {
    console.log("Received POST request to /events");
    console.log("Request Body:", req.body);
    (0, eventController_1.createEvent)(req, res).catch(next);
});
router.get("/my-events", authMiddleware_1.verifyJWT, authMiddleware_1.ensureUserExists, eventController_1.getEventsByUser);
router.get("/:eventId", eventController_1.getEventById);
router.delete("/:uniqueUrl", authMiddleware_1.verifyJWT, (req, res, next) => (0, eventController_1.cancelEvent)(req, res).catch(next));
router.post("/:eventId/add-to-list", authMiddleware_1.verifyJWT, (req, res, next) => {
    (0, eventController_1.addToEventList)(req, res).catch(next);
});
router.delete("/:eventId/remove-from-list", authMiddleware_1.verifyJWT, (req, res, next) => {
    (0, eventController_1.removeFromEventList)(req, res).catch(next);
});
// router.post("/:uniqueUrl/rsvp", rsvpToEvent); // RSVP by uniqueUrl
// RSVP Routes
router.post("/:eventId/rsvp", eventController_1.rsvpToEvent);
router.get("/:eventId/rsvps", eventController_1.getEventRsvps);
router.delete("/:eventId/rsvp", eventController_1.removeRsvp);
exports.default = router;

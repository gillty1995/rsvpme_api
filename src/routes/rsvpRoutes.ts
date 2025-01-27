import { Router } from "express";
import { rsvpToEvent, cancelRsvp } from "../controllers/rsvpController";
import { verifyJWT } from "../middlewares/authMiddleware"; // Assuming you have a middleware to verify JWT

const router = Router();

// RSVP to an event
router.post("/events/:eventId/rsvp", verifyJWT, rsvpToEvent);

// Cancel RSVP for an event
router.delete("/events/:eventId/rsvp", verifyJWT, cancelRsvp);

export default router;
import { Router } from "express";
import { rsvpToEvent, cancelRsvp, getUserRsvps } from "../controllers/rsvpController";
import { verifyJWT } from "../middlewares/authMiddleware"; // ✅ Import authentication middleware

const router = Router();

// ✅ Add RSVP (Save event to user’s list) - **Protected**
router.post("/events/:eventId/rsvp", verifyJWT, rsvpToEvent);

// ✅ Remove RSVP (Remove event from user’s list) - **Protected**
router.delete("/events/:eventId/rsvp", verifyJWT, cancelRsvp);

// ✅ Get all RSVP'd events for the user - **Protected**
router.get("/rsvps", verifyJWT, getUserRsvps);

export default router;
import { Router } from "express";
import { rsvpToEvent, cancelRsvp, getUserRsvps } from "../controllers/rsvpController";
import { verifyJWT } from "../middlewares/authMiddleware"; 

const router = Router();

router.post("/events/:eventId/rsvp", verifyJWT, rsvpToEvent);

router.delete("/events/:eventId/rsvp", verifyJWT, cancelRsvp);

// get rsvps 
router.get("/rsvps", verifyJWT, getUserRsvps);

export default router;
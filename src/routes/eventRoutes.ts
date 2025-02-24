import { Router, Request, Response } from "express"; // Explicitly import Request and Response
import { createEvent, getEventsByUser } from "../controllers/eventController"; 
import { rsvpToEvent, cancelRsvp } from "../controllers/rsvpController"; 
import { verifyJWT } from "../middlewares/authMiddleware";

const router = Router();

// Event Routes
router.post("/", verifyJWT, (req: Request, res: Response, next) => {
    console.log("Received POST request to /events");
    console.log("Request Body:", req.body); // Log the incoming request body
    createEvent(req, res).catch(next); // Ensure errors are passed to the next middleware
  });
router.get("/:userId/my-events", verifyJWT, getEventsByUser); // Ensure this route is first
// router.get("/:uniqueUrl", getEventById); // Route to get an event by uniqueUrl

// RSVP Routes
router.post("/:uniqueUrl/rsvp", rsvpToEvent); // RSVP by uniqueUrl
router.delete("/:uniqueUrl/rsvp", cancelRsvp); // Cancel RSVP by uniqueUrl

export default router;
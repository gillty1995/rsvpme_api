import { Router, Request, Response } from "express"; 
import { createEvent, getEventsByUser, getEventById } from "../controllers/eventController"; 
import { rsvpToEvent, cancelRsvp } from "../controllers/rsvpController"; 
import { verifyJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", (req: Request, res: Response, next) => {
  console.log("Received POST request to /events");
  console.log("Request Body:", req.body); 
  createEvent(req, res).catch(next); 
});

router.get("/my-events", verifyJWT, getEventsByUser);

router.get("/:eventId", getEventById);

router.post("/:uniqueUrl/rsvp", rsvpToEvent); // RSVP by uniqueUrl
router.delete("/:uniqueUrl/rsvp", cancelRsvp); // Cancel RSVP by uniqueUrl

export default router;
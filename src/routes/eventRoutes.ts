import { Router, Request, Response } from "express"; 
import { createEvent, getEventsByUser, getEventById, cancelEvent } from "../controllers/eventController"; 
import { rsvpToEvent, } from "../controllers/rsvpController"; 
import { verifyJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", (req: Request, res: Response, next) => {
  console.log("Received POST request to /events");
  console.log("Request Body:", req.body); 
  createEvent(req, res).catch(next); 
});

router.get("/my-events", verifyJWT, getEventsByUser);

router.get("/:eventId", getEventById);
router.delete("/:uniqueUrl", verifyJWT, (req, res, next) => cancelEvent(req, res).catch(next));

// router.post("/:uniqueUrl/rsvp", rsvpToEvent); // RSVP by uniqueUrl


export default router;
import { Router, Request, Response } from "express"; 
import { createEvent, getEventsByUser, getEventById, cancelEvent, addToEventList, removeFromEventList, getEventRsvps, removeRsvp, rsvpToEvent } from "../controllers/eventController"; 
// import { rsvpToEvent, } from "../controllers/rsvpController"; 
import { verifyJWT, ensureUserExists } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", (req: Request, res: Response, next) => {
  console.log("Received POST request to /events");
  console.log("Request Body:", req.body); 
  createEvent(req, res).catch(next); 
});

router.get("/my-events", verifyJWT, ensureUserExists, getEventsByUser);

router.get("/:eventId", getEventById);
router.delete("/:uniqueUrl", verifyJWT, (req, res, next) => cancelEvent(req, res).catch(next));

router.post("/:eventId/add-to-list", verifyJWT, (req, res, next) => {
    addToEventList(req, res).catch(next);
  });


router.delete("/:eventId/remove-from-list", verifyJWT, (req, res, next) => {
    removeFromEventList(req, res).catch(next);
  });

// router.post("/:uniqueUrl/rsvp", rsvpToEvent); // RSVP by uniqueUrl

// RSVP Routes
router.post("/:eventId/rsvp", rsvpToEvent); 
router.get("/:eventId/rsvps", getEventRsvps); 
router.delete("/:eventId/rsvp", removeRsvp); 


export default router;
import { Router } from "express";
import userRoutes from "./userRoutes"; 
import eventRoutes from "./eventRoutes"; 
import rsvpRoutes from "./rsvpRoutes";
import contactRoutes from "./contactRoutes";
import chatRoutes from "./chatRoutes";
import placesRoutes from "./placesRoutes";

const router = Router();

// User Routes
router.use("/users", userRoutes); 

// Event Routes
router.use("/events", eventRoutes); 

// Rsvp Routes ... may need to be removed if not used
router.use("/rsvps", rsvpRoutes);

// Contact Routes
router.use("/", contactRoutes);

// Chat Routes
router.use("/chat", chatRoutes);

// Places API Routes (Google Maps)
router.use("/places", placesRoutes);

export default router;
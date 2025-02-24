import { Router } from "express";
import userRoutes from "./userRoutes"; // Assuming you have user-related routes
import eventRoutes from "./eventRoutes"; // Import the event routes
import rsvpRoutes from "./rsvpRoutes"

const router = Router();

// User Routes
router.use("/users", userRoutes); 

// Event Routes
router.use("/events", eventRoutes);  // Integrating event routes under /events

router.use("/rsvps", rsvpRoutes);

export default router;
import { Router } from "express";
import userRoutes from "./userRoutes"; // Assuming you have user-related routes
import eventRoutes from "./eventRoutes"; // Import the event routes
import rsvpRoutes from "./rsvpRoutes";
import contactRoutes from "./contactRoutes";
import chatRoutes from "./chatRoutes";

const router = Router();

// User Routes
router.use("/users", userRoutes); 

// Event Routes
router.use("/events", eventRoutes); 

router.use("/rsvps", rsvpRoutes);

router.use("/", contactRoutes);

router.use("/chat", chatRoutes);

export default router;
import { Router } from "express";
import userRoutes from "./userRoutes";
import rsvpRoutes from "./rsvpRoutes";  // Add the RSVP routes here

const router = Router();

router.use("/users", userRoutes);
router.use("/events", rsvpRoutes);  // Integrating the RSVP routes under /events

export default router;
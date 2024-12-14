import { Router } from "express";
import userRoutes from "./userRoutes";  

const router = Router();

router.use("/users", userRoutes);

// Additional routes here

export default router;
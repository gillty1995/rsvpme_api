import express from "express";
import { sendMessage } from "../controllers/contactController";

const router = express.Router();

router.post("/contact", sendMessage);

export default router;
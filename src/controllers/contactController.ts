import { Request, Response, RequestHandler } from "express";
import { sendContactEmail } from "../services/emailService";

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const response = await sendContactEmail(email, subject, message);

    if (response.success) {
      res.status(200).json({ message: response.message });
    } else {
      res.status(500).json({ error: response.message });
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
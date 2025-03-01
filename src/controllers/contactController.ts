import { Request, Response, RequestHandler } from "express";
import { sendContactEmail } from "../services/emailService";

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    console.log("✅ Contact request received:", req.body);

    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      console.log("❌ Missing fields in request");
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    console.log("📤 Sending email...");
    const response = await sendContactEmail(email, subject, message);

    if (response.success) {
      console.log("✅ Email sent successfully:", response.message);
      res.status(200).json({ message: response.message });
    } else {
      console.error("❌ Failed to send email:", response.message);
      res.status(500).json({ error: response.message });
    }
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
import { Request, Response } from "express";
import Chat from "../models/Chat";

// Fetch chat messages for a specific event
export const getChatMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const messages = await Chat.find({ eventId }).populate("userId", "email").sort({ timestamp: 1 }); // Sort oldest to newest

    res.status(200).json({ messages }); // ✅ Always end with a response
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
};

// Post a new chat message
export const postChatMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { eventId } = req.params;
      const { message } = req.body;
  
      console.log("🔍 Debug: Full Request User Object:", req.user);
  
      if (!req.user) {
        console.error("🚨 Missing Auth0 user data in request!");
        res.status(401).json({ error: "Unauthorized: Missing user data." });
        return;
      }
  
      const userId = req.user.sub;
      const email = req.user.email;
  
      console.log("🔍 Debug: Extracted userId and email:", { userId, email });
  
      if (!userId || !message || !email) {
        console.error("🚨 Missing required fields:", { userId, email, message });
        res.status(400).json({ error: "User ID, email, and message are required." });
        return;
      }
  
      const newMessage = new Chat({ eventId, userId, email, message });
      await newMessage.save();
  
      const updatedMessages = await Chat.find({ eventId }).sort({ timestamp: 1 });
  
      res.status(201).json({ messages: updatedMessages });
    } catch (error) {
      console.error("❌ Error posting chat message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  };
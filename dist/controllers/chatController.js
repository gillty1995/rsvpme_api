"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postChatMessage = exports.getChatMessages = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
// Fetch chat messages for a specific event
const getChatMessages = async (req, res) => {
    try {
        const { eventId } = req.params;
        const messages = await Chat_1.default.find({ eventId }).populate("userId", "email").sort({ timestamp: 1 }); // Sort oldest to newest
        res.status(200).json({ messages }); // ✅ Always end with a response
    }
    catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).json({ error: "Failed to fetch chat messages" });
    }
};
exports.getChatMessages = getChatMessages;
// Post a new chat message
const postChatMessage = async (req, res) => {
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
        const newMessage = new Chat_1.default({ eventId, userId, email, message });
        await newMessage.save();
        const updatedMessages = await Chat_1.default.find({ eventId }).sort({ timestamp: 1 });
        res.status(201).json({ messages: updatedMessages });
    }
    catch (error) {
        console.error("❌ Error posting chat message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};
exports.postChatMessage = postChatMessage;

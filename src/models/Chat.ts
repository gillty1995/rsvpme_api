import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  eventId: string; // Links chat messages to an event
  userId: string; // Sender's ID
  email: string; 
  message: string;
  timestamp: Date;
}

const ChatSchema = new Schema<IChat>({
  eventId: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>("Chat", ChatSchema);
import mongoose, { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";  // Import uuid for unique URL generation

export interface IEvent extends Document {
  name: string;
  date: Date;
  location: string;
  description: string;
  type: string; 
  rsvpCount: number;
  attendees: mongoose.Types.ObjectId[];
  uniqueUrl: string; 
  createdBy: string;  // Change createdBy to a string
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    type: {
      type: String,
      required: [true, "Event type is required"],  // Ensure event type is required
    },
    rsvpCount: {
      type: Number,
      default: 0,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // The users who RSVP'd for the event
      },
    ],
    uniqueUrl: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),  // Automatically generate unique URL using uuid
    },
    createdBy: {
      type: String,  // Now stores userId as string
      required: true,
    },
  },
  { timestamps: true }
);

const Event = model<IEvent>("Event", EventSchema);

export default Event;
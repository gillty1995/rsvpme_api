import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Event Document
export interface IEvent extends Document {
  name: string;
  date: Date;
  location: string;
  description: string;
  rsvpCount: number;
  attendees: mongoose.Types.ObjectId[];
}

// Event Schema
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
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
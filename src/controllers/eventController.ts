import { Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../models/Event";
import User from "../models/User";

// Create Event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  console.log("Incoming request to createEvent");
  try {
    console.log("Authenticated User:", req.user);
    console.log("Full req.user object:", req.user);

    const userId = req.user ? req.user.sub : null; // Extract User ID
    console.log("Extracted User ID:", userId);

    if (!userId) {
      console.error("No userId found, user might not be authenticated.");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Validate event type
    const { name, date, location, description, type } = req.body;

    // Validate event type
    if (!type) {
      res.status(400).json({ message: "Event type is required" });
      return;
    }

    const validEventTypes = ["conference", "meetup", "workshop"];
    if (!validEventTypes.includes(type)) {
      res.status(400).json({ message: "Invalid event type" });
      return;
    }

    // Prepare Event Data
    const eventData: any = {
      name,
      date,
      location,
      description,
      type,
      createdBy: userId,  // Directly using userId string
    };

    console.log("Final Event Data Before Save:", JSON.stringify(eventData, null, 2));

    // Save Event
    const newEvent = new Event(eventData);
    await newEvent.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5005";
    res.status(201).json({
      message: "Event created successfully",
      event: {
        id: newEvent._id,
        name: newEvent.name,
        date: newEvent.date,
        location: newEvent.location,
        description: newEvent.description,
        type: newEvent.type,
        eventUrl: `${baseUrl}/api/events/${newEvent.uniqueUrl}`,
        createdBy: newEvent.createdBy.toString(),  // Return userId string directly
      },
    });
  } catch (error: unknown) {
    console.error("Error creating event:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error creating event", error: errorMessage });
  }
};

// Get Events Created by User
export const getEventsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Authenticated User:", req.user);
    if (!req.user) {
     res.status(401).json({ message: "User not authenticated" });
     return;
    }

    const userId = (req.user?.sub || req.query.userId) as string;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid User ID format" });
      return;
    }

    // Fetch events created by this user
    const events = await Event.find({ createdBy: userId });
    if (!events || events.length === 0) {
      res.status(404).json({ message: "No events found" });
      return;
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../models/Event";
import User from "../models/User";
import { eventOptions } from "../utils/eventOptions"; 
import jwt from "jsonwebtoken"; 

// Create Event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  console.log("Incoming request to createEvent");

  try {
    let userId = "guest"; // Default for guests

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1]; // Extract token
      try {
        const decoded = jwt.decode(token) as { sub: string } | null; // Decode JWT
        if (decoded && decoded.sub) {
          userId = decoded.sub; // Assign Auth0 user ID if available
        }
      } catch (decodeError) {
        console.error("Error decoding JWT:", decodeError);
      }
    }

    console.log("Extracted User ID:", userId);

    // Extract event fields from request
    const { name, date, location, description, type } = req.body;

    // Validate event type
    if (!type || !eventOptions.includes(type)) {
      res.status(400).json({ message: "Invalid event type" });
      return;
    }

    // Convert date to ISO format
    const formattedDate = new Date(date).toISOString();

    // Prepare event data
    const eventData = {
      name,
      date: formattedDate,
      location,
      description,
      type,
      createdBy: userId, // Store user ID if logged in, otherwise "guest"
    };

    // Save event
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
        createdBy: newEvent.createdBy.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error });
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

    const userId = req.user.sub; // Use Auth0 user ID
    console.log("Fetching events for user ID:", userId);

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Fetch events where `createdBy` matches the Auth0 user ID
    const events = await Event.find({ createdBy: userId });

    if (!events || events.length === 0) {
      res.status(404).json({ message: "No events found" });
      return;
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId } = req.params;
    console.log("Fetching event with eventId:", eventId);

    // Determine whether the eventId is an ObjectId or a UUID (uniqueUrl)
    const isMongoId = mongoose.Types.ObjectId.isValid(eventId);
    const isUUID = /^[0-9a-fA-F-]{36}$/.test(eventId);

    if (!isMongoId && !isUUID) {
      console.error("Invalid event ID format.");
      res.status(400).json({ message: "Invalid event ID format" });
      return;
    }

    // Find the event by _id if it's a MongoDB ObjectId, otherwise by uniqueUrl
    const event = isMongoId
      ? await Event.findById(eventId)
      : await Event.findOne({ uniqueUrl: eventId });

    if (!event) {
      console.error("Event not found in database.");
      res.status(404).json({ message: "Event not found" });
      return;
    }

    console.log("Event found:", event);
    res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    next(error);
  }
};
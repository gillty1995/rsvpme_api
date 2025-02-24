import { Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../models/Event";
import User from "../models/User";

// RSVP to an Event
export const rsvpToEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    // Ensure userId is not undefined
    if (!userId) {
      res.status(400).json({ message: "User not authenticated" });
      return;
    }

    // Ensure eventId is converted to ObjectId
    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the event
    const event = await Event.findById(eventObjectId);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Check if the user has already RSVP'd
    if (event.attendees.includes(userObjectId)) {
      res.status(400).json({ message: "You have already RSVP'd to this event" });
      return;
    }

    // Add the user to the attendees list and increment the RSVP count
    event.attendees.push(userObjectId);
    event.rsvpCount += 1;
    await event.save();

    // Return the event data with the unique URL for the RSVP
    res.status(200).json({
      message: "RSVP successful",
      event,
      uniqueUrl: `http://yourapp.com/events/${event.uniqueUrl}`,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error RSVPing", error: errorMessage });
  }
};

// Cancel RSVP for an Event
export const cancelRsvp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    // Ensure userId is not undefined
    if (!userId) {
      res.status(400).json({ message: "User not authenticated" });
      return;
    }

    // Ensure eventId is converted to ObjectId
    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the event
    const event = await Event.findById(eventObjectId);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Check if the user has RSVP'd
    if (!event.attendees.includes(userObjectId)) {
      res.status(400).json({ message: "You have not RSVP'd to this event" });
      return;
    }

    // Remove the user from the attendees list and decrement the RSVP count
    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== userObjectId.toString()
    );
    event.rsvpCount -= 1;
    await event.save();

    res.status(200).json({
      message: "RSVP canceled successfully",
      event,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error canceling RSVP", error: errorMessage });
  }
};

// Get rsvps 
export const getUserRsvps = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // Get the user ID from the JWT

    // Ensure userId is not undefined
    if (!userId) {
      res.status(400).json({ message: "User not authenticated" });
      return;
    }

    // Query for events that the user has created (createdBy is the userId)
    const events = await Event.find({ createdBy: userId })  // Assuming 'createdBy' field stores the creator's userId
      .populate("attendees", "name email")  // Populating the attendees' information
      .exec();

    // If no events are found
    if (!events.length) {
      res.status(404).json({ message: "No events created by this user" });
      return;
    }

    // Respond with the list of events created by the user
    res.status(200).json({
      message: "User created events retrieved successfully",
      events,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error fetching events", error: errorMessage });
  }
};

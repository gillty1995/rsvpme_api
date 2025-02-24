"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRsvp = exports.rsvpToEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Event_1 = __importDefault(require("../models/Event"));
// RSVP to an Event
const rsvpToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user?.id;
        // Ensure userId is not undefined
        if (!userId) {
            res.status(400).json({ message: "User not authenticated" });
            return;
        }
        // Ensure eventId is converted to ObjectId
        const eventObjectId = new mongoose_1.default.Types.ObjectId(eventId);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Find the event
        const event = await Event_1.default.findById(eventObjectId);
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error RSVPing", error: errorMessage });
    }
};
exports.rsvpToEvent = rsvpToEvent;
// Cancel RSVP for an Event
const cancelRsvp = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user?.id;
        // Ensure userId is not undefined
        if (!userId) {
            res.status(400).json({ message: "User not authenticated" });
            return;
        }
        // Ensure eventId is converted to ObjectId
        const eventObjectId = new mongoose_1.default.Types.ObjectId(eventId);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Find the event
        const event = await Event_1.default.findById(eventObjectId);
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
        event.attendees = event.attendees.filter((attendee) => attendee.toString() !== userObjectId.toString());
        event.rsvpCount -= 1;
        await event.save();
        res.status(200).json({
            message: "RSVP canceled successfully",
            event,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error canceling RSVP", error: errorMessage });
    }
};
exports.cancelRsvp = cancelRsvp;

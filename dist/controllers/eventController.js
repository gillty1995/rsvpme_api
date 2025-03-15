"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRsvp = exports.getEventRsvps = exports.rsvpToEvent = exports.removeFromEventList = exports.addToEventList = exports.cancelEvent = exports.getEventById = exports.getEventsByUser = exports.createEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Event_1 = __importDefault(require("../models/Event"));
const User_1 = __importDefault(require("../models/User"));
const eventOptions_1 = require("../utils/eventOptions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create Event
const createEvent = async (req, res) => {
    console.log("Incoming request to createEvent");
    try {
        let userId = "guest"; // Default for guests
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1]; // Extract token
            try {
                const decoded = jsonwebtoken_1.default.decode(token); // Decode JWT
                if (decoded && decoded.sub) {
                    userId = decoded.sub; // Assign Auth0 user ID if available
                }
            }
            catch (decodeError) {
                console.error("Error decoding JWT:", decodeError);
            }
        }
        console.log("Extracted User ID:", userId);
        // Extract event fields from request
        const { name, date, location, description, type } = req.body;
        // Validate event type
        if (!type || !eventOptions_1.eventOptions.includes(type)) {
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
        const newEvent = new Event_1.default(eventData);
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
    }
    catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Error creating event", error });
    }
};
exports.createEvent = createEvent;
// Get Events Created by User
const getEventsByUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const userId = req.user.sub;
        console.log("Fetching events for user ID:", userId);
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        // ✅ Check if the user exists in MongoDB
        let user = await User_1.default.findOne({ _id: userId }).populate("rsvpEvents");
        if (!user) {
            console.log(`User not found, creating new user in DB for ${userId}`);
            user = new User_1.default({
                _id: userId,
                email: req.user.email || "",
                name: req.user.name || "Anonymous",
                rsvpEvents: [],
            });
            await user.save();
        }
        // Fetch events created by the user
        const createdEvents = await Event_1.default.find({ createdBy: userId });
        res.status(200).json({
            createdEvents,
            attendingEvents: user.rsvpEvents || [],
        });
    }
    catch (error) {
        console.error("Error fetching user events:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getEventsByUser = getEventsByUser;
const getEventById = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        console.log("Fetching event with eventId:", eventId);
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        const isUUID = /^[0-9a-fA-F-]{36}$/.test(eventId);
        if (!isMongoId && !isUUID) {
            console.error("Invalid event ID format.");
            res.status(400).json({ message: "Invalid event ID format" });
            return;
        }
        // Find the event by _id if it's a MongoDB ObjectId, otherwise by uniqueUrl
        const event = isMongoId
            ? await Event_1.default.findById(eventId)
            : await Event_1.default.findOne({ uniqueUrl: eventId });
        if (!event) {
            console.error("Event not found in database.");
            res.status(404).json({ message: "Event not found" });
            return;
        }
        console.log("Event found:", event);
        res.status(200).json({ event });
    }
    catch (error) {
        console.error("Error fetching event:", error);
        next(error);
    }
};
exports.getEventById = getEventById;
// delete event
const cancelEvent = async (req, res) => {
    try {
        const { uniqueUrl } = req.params;
        const userId = req.user?.sub; // Auth0 user ID
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const event = await Event_1.default.findOne({ uniqueUrl });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        // Check if the logged-in user is the creator of the event
        if (event.createdBy !== userId) {
            res.status(403).json({ message: "You are not authorized to delete this event" });
            return;
        }
        // Delete the event
        await Event_1.default.deleteOne({ uniqueUrl });
        res.status(200).json({ message: "Event deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.cancelEvent = cancelEvent;
// add to event list 
const addToEventList = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user?.sub; // Auth0 user ID (string)
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Determine if eventId is an ObjectId or UUID
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        // ✅ Fetch event by either MongoDB `_id` or `uniqueUrl`
        const event = isMongoId
            ? await Event_1.default.findById(eventId).lean()
            : await Event_1.default.findOne({ uniqueUrl: eventId }).lean();
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        // Ensure user is not the event creator
        if (event.createdBy === userId) {
            res.status(400).json({ message: "You cannot add your own event to your list." });
            return;
        }
        // ✅ Fix: Ensure user exists, otherwise create them
        let user = await User_1.default.findOne({ _id: userId });
        if (!user) {
            console.log(`User not found in DB, creating user ${userId}`);
            user = new User_1.default({
                _id: userId, // Auth0 user ID
                email: req.user?.email || "",
                name: req.user?.name || "Anonymous",
                rsvpEvents: [],
            });
            await user.save();
        }
        // ✅ Ensure event `_id` is stored properly
        const eventObjectId = isMongoId
            ? new mongoose_1.default.Types.ObjectId(eventId)
            : new mongoose_1.default.Types.ObjectId(event._id);
        // Ensure the event is not already in the user's RSVP list
        if (user.rsvpEvents.some((e) => e.toString() === eventObjectId.toString())) {
            res.status(400).json({ message: "Event is already in your RSVP list." });
            return;
        }
        // Add event to user's RSVP list
        user.rsvpEvents.push(eventObjectId);
        await user.save();
        res.status(200).json({ message: "Event added to your list successfully", eventId });
    }
    catch (error) {
        console.error("Error adding event to list:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.addToEventList = addToEventList;
// remove attendence
const removeFromEventList = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user?.sub; // Auth0 user ID (string)
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Determine if eventId is an ObjectId or UUID
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        // Find event by _id or uniqueUrl
        const event = isMongoId
            ? await Event_1.default.findById(eventId).lean()
            : await Event_1.default.findOne({ uniqueUrl: eventId }).lean();
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        // Find the user and remove the event from their RSVP list
        const user = await User_1.default.findOne({ _id: userId });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const eventObjectId = isMongoId
            ? new mongoose_1.default.Types.ObjectId(eventId)
            : new mongoose_1.default.Types.ObjectId(event._id);
        // Check if the event exists in the user's RSVP list
        const eventIndex = user.rsvpEvents.findIndex((e) => e.toString() === eventObjectId.toString());
        if (eventIndex === -1) {
            res.status(400).json({ message: "Event not in your RSVP list" });
            return;
        }
        // Remove the event from the RSVP list
        user.rsvpEvents.splice(eventIndex, 1);
        await user.save();
        res.status(200).json({ message: "Removed from your RSVP list successfully" });
    }
    catch (error) {
        console.error("Error removing event from list:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.removeFromEventList = removeFromEventList;
// RSVP to an Event
const rsvpToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name } = req.body; // Get the RSVP name from the request body
        if (!name || name.trim() === "") {
            res.status(400).json({ message: "RSVP name is required" });
            return;
        }
        // Check if the eventId is a valid MongoDB ObjectId or a UUID
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        const event = isMongoId
            ? await Event_1.default.findById(eventId)
            : await Event_1.default.findOne({ uniqueUrl: eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        // Prevent duplicate RSVPs
        if (event.rsvps.some((rsvp) => rsvp.name.toLowerCase() === name.toLowerCase())) {
            res.status(400).json({ message: "You have already RSVP'd for this event" });
            return;
        }
        // Add the new RSVP
        event.rsvps.push({ name });
        event.rsvpCount += 1; // Increment RSVP count
        await event.save();
        res.status(200).json({ message: "RSVP added successfully", rsvps: event.rsvps });
    }
    catch (error) {
        console.error("Error adding RSVP:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.rsvpToEvent = rsvpToEvent;
// Get RSVPs for an Event
const getEventRsvps = async (req, res) => {
    try {
        const { eventId } = req.params;
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        const event = isMongoId
            ? await Event_1.default.findById(eventId)
            : await Event_1.default.findOne({ uniqueUrl: eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json({ rsvps: event.rsvps });
    }
    catch (error) {
        console.error("Error fetching RSVPs:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getEventRsvps = getEventRsvps;
// Remove RSVP
const removeRsvp = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name } = req.body; // Get the name to remove
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        const event = isMongoId
            ? await Event_1.default.findById(eventId)
            : await Event_1.default.findOne({ uniqueUrl: eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        // Remove the RSVP by filtering the array
        const updatedRsvps = event.rsvps.filter((rsvp) => rsvp.name.toLowerCase() !== name.toLowerCase());
        if (updatedRsvps.length === event.rsvps.length) {
            res.status(400).json({ message: "RSVP name not found" });
            return;
        }
        event.rsvps = updatedRsvps;
        event.rsvpCount -= 1; // Decrement RSVP count
        await event.save();
        res.status(200).json({ message: "RSVP removed successfully", rsvps: event.rsvps });
    }
    catch (error) {
        console.error("Error removing RSVP:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.removeRsvp = removeRsvp;

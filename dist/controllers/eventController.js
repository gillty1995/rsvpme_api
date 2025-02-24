"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventById = exports.createEvent = void 0;
const Event_1 = __importDefault(require("../models/Event"));
// Create Event
const createEvent = async (req, res) => {
    try {
        const { name, date, location, description, type } = req.body;
        // Ensure 'type' is passed and is not empty
        if (!type) {
            res.status(400).json({ message: "Event type is required" });
            return;
        }
        // Create a new event with the data
        const newEvent = new Event_1.default({
            name,
            date,
            location,
            description,
            type, // Add type here
        });
        // Save the event to the database
        await newEvent.save();
        // Dynamically generate the unique URL using the event ID
        const baseUrl = process.env.BASE_URL || "http://localhost:5005"; // Default to local URL if not found
        // Respond with the event data and eventId URL
        res.status(201).json({
            message: "Event created successfully",
            event: {
                id: newEvent._id,
                name: newEvent.name,
                date: newEvent.date,
                location: newEvent.location,
                description: newEvent.description,
                type: newEvent.type, // Include event type in the response
                eventUrl: `${baseUrl}/api/events/${newEvent._id}`,
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error creating event", error: errorMessage });
    }
};
exports.createEvent = createEvent;
// Get Event by eventId
const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params; // Get eventId from URL params
        // Find the event by eventId
        const event = await Event_1.default.findById(eventId);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        // Return event details if found
        res.status(200).json({ event });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error fetching event", error: errorMessage });
    }
};
exports.getEventById = getEventById;

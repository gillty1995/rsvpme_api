"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRsvps = exports.cancelRsvp = exports.rsvpToEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Event_1 = __importDefault(require("../models/Event"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ✅ RSVP to an Event
const rsvpToEvent = async (req, res) => {
    console.log("Incoming RSVP request...");
    try {
        let userId = "guest"; // Default for guests
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jsonwebtoken_1.default.decode(token);
                if (decoded && decoded.sub) {
                    userId = decoded.sub; // Assign Auth0 user ID
                }
            }
            catch (decodeError) {
                console.error("Error decoding JWT:", decodeError);
            }
        }
        if (userId === "guest") {
            res.status(401).json({ message: "Unauthorized: Please log in" });
            return;
        }
        const { eventId } = req.params;
        console.log("Extracted User ID:", userId);
        console.log("Target Event ID:", eventId);
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        const isUUID = /^[0-9a-fA-F-]{36}$/.test(eventId);
        if (!isMongoId && !isUUID) {
            res.status(400).json({ message: "Invalid event ID format" });
            return;
        }
        // Find the event by _id if it's a MongoDB ObjectId, otherwise by uniqueUrl
        const event = isMongoId
            ? await Event_1.default.findById(eventId)
            : await Event_1.default.findOne({ uniqueUrl: eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Prevent duplicate RSVPs
        if (event.attendees.some((attendee) => attendee.equals(userObjectId))) {
            res.status(400).json({ message: "You have already RSVP'd to this event" });
            return;
        }
        // ✅ Add user to attendees and increment RSVP count
        event.attendees.push(userObjectId);
        event.rsvpCount += 1;
        await event.save();
        console.log("RSVP Successful:", userId);
        res.status(200).json({
            message: "RSVP successful! Event added to your list.",
            event,
        });
    }
    catch (error) {
        console.error("Error RSVPing:", error);
        res.status(500).json({ message: "Error RSVPing", error });
    }
};
exports.rsvpToEvent = rsvpToEvent;
// ✅ Cancel RSVP
const cancelRsvp = async (req, res) => {
    console.log("Incoming RSVP cancel request...");
    try {
        let userId = "guest";
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jsonwebtoken_1.default.decode(token);
                if (decoded && decoded.sub) {
                    userId = decoded.sub;
                }
            }
            catch (decodeError) {
                console.error("Error decoding JWT:", decodeError);
            }
        }
        if (userId === "guest") {
            res.status(401).json({ message: "Unauthorized: Please log in" });
            return;
        }
        const { eventId } = req.params;
        console.log("User Canceling RSVP:", userId);
        console.log("Target Event ID:", eventId);
        const isMongoId = mongoose_1.default.Types.ObjectId.isValid(eventId);
        const isUUID = /^[0-9a-fA-F-]{36}$/.test(eventId);
        if (!isMongoId && !isUUID) {
            res.status(400).json({ message: "Invalid event ID format" });
            return;
        }
        const event = isMongoId
            ? await Event_1.default.findById(eventId)
            : await Event_1.default.findOne({ uniqueUrl: eventId });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Check if the user has RSVP'd
        if (!event.attendees.some((attendee) => attendee.equals(userObjectId))) {
            res.status(400).json({ message: "You have not RSVP'd to this event" });
            return;
        }
        // ✅ Remove user from attendees and decrement RSVP count
        event.attendees = event.attendees.filter((attendee) => !attendee.equals(userObjectId));
        event.rsvpCount -= 1;
        await event.save();
        console.log("RSVP Canceled:", userId);
        res.status(200).json({
            message: "RSVP canceled successfully",
            event,
        });
    }
    catch (error) {
        console.error("Error canceling RSVP:", error);
        res.status(500).json({ message: "Error canceling RSVP", error });
    }
};
exports.cancelRsvp = cancelRsvp;
// ✅ Get All Events a User Has RSVP'd To
const getUserRsvps = async (req, res) => {
    console.log("Fetching user RSVP list...");
    try {
        let userId = "guest";
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jsonwebtoken_1.default.decode(token);
                if (decoded && decoded.sub) {
                    userId = decoded.sub;
                }
            }
            catch (decodeError) {
                console.error("Error decoding JWT:", decodeError);
            }
        }
        if (userId === "guest") {
            res.status(401).json({ message: "Unauthorized: Please log in" });
            return;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // ✅ Fetch only events where the user has RSVP’d
        const rsvpEvents = await Event_1.default.find({ attendees: userObjectId })
            .select("name date location description type uniqueUrl createdBy")
            .exec();
        if (!rsvpEvents.length) {
            res.status(404).json({ message: "No RSVP'd events found" });
            return;
        }
        console.log("User RSVP List Retrieved:", rsvpEvents.length);
        res.status(200).json({
            message: "User RSVP'd events retrieved successfully",
            rsvpEvents,
        });
    }
    catch (error) {
        console.error("Error fetching RSVP'd events:", error);
        res.status(500).json({ message: "Error fetching RSVP'd events", error });
    }
};
exports.getUserRsvps = getUserRsvps;

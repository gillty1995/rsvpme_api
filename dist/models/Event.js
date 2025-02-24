"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid"); // Import uuid for unique URL generation
const EventSchema = new mongoose_1.Schema({
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
        required: [true, "Event type is required"], // Ensure event type is required
    },
    rsvpCount: {
        type: Number,
        default: 0,
    },
    attendees: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User", // The users who RSVP'd for the event
        },
    ],
    uniqueUrl: {
        type: String,
        required: true,
        unique: true,
        default: () => (0, uuid_1.v4)(), // Automatically generate unique URL using uuid
    },
}, { timestamps: true });
const Event = (0, mongoose_1.model)("Event", EventSchema);
exports.default = Event;

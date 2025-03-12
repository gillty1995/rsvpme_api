"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rsvpController_1 = require("../controllers/rsvpController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // ✅ Import authentication middleware
const router = (0, express_1.Router)();
// ✅ Add RSVP (Save event to user’s list) - **Protected**
router.post("/events/:eventId/rsvp", authMiddleware_1.verifyJWT, rsvpController_1.rsvpToEvent);
// ✅ Remove RSVP (Remove event from user’s list) - **Protected**
router.delete("/events/:eventId/rsvp", authMiddleware_1.verifyJWT, rsvpController_1.cancelRsvp);
// ✅ Get all RSVP'd events for the user - **Protected**
router.get("/rsvps", authMiddleware_1.verifyJWT, rsvpController_1.getUserRsvps);
exports.default = router;

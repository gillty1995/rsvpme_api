"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// Google Maps API Key from .env
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY);
// 🌍 Location Search (Autocomplete)
router.get("/search", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
    }
    console.log(`🔎 Searching location using Geocoding API for: ${query}`);
    console.log(`🚀 Using API Key: ${GOOGLE_MAPS_API_KEY}`);
    try {
        const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address: query,
                key: GOOGLE_MAPS_API_KEY,
            },
        });
        console.log("✅ Google Geocoding API Response:", JSON.stringify(response.data, null, 2));
        res.json(response.data);
    }
    catch (error) {
        console.error("❌ Error fetching location from Geocoding API:", error.response?.data || error);
        res.status(500).json({ error: "Failed to fetch location" });
    }
});
// 📍 Get Place Details (Address & Coordinates)
router.get("/details", async (req, res) => {
    const { placeId } = req.query;
    if (!placeId) {
        res.status(400).json({ error: "placeId parameter is required" });
        return;
    }
    console.log(`📌 Received place details request for: ${placeId}`);
    console.log(`🚀 Using API Key: ${GOOGLE_MAPS_API_KEY}`);
    try {
        const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
            params: {
                place_id: placeId,
                key: GOOGLE_MAPS_API_KEY,
                fields: "formatted_address,geometry",
            },
        });
        console.log("✅ Google API Response:", JSON.stringify(response.data, null, 2));
        res.json(response.data);
    }
    catch (error) {
        console.error("❌ Error fetching place details from Google:", error.response?.data || error);
        res.status(500).json({ error: "Failed to fetch place details" });
    }
});
exports.default = router;

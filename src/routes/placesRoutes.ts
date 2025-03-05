import express, { Request, Response, Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router: Router = express.Router();

// Google Maps API Key from .env
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY);

// Define query parameter types for TypeScript
interface SearchQuery {
  query?: string; // Query parameter for search
}

interface DetailsQuery {
  placeId?: string; // Query parameter for details
}

// 🌍 Location Search (Autocomplete)
router.get("/search", async (req: Request<{}, {}, {}, { query: string }>, res: Response) => {
    const { query } = req.query;

    if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
    }

    console.log(`🔎 Searching location using Geocoding API for: ${query}`);
    console.log(`🚀 Using API Key: ${GOOGLE_MAPS_API_KEY}`);

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
                params: {
                    address: query,
                    key: GOOGLE_MAPS_API_KEY,
                },
            }
        );

        console.log("✅ Google Geocoding API Response:", JSON.stringify(response.data, null, 2));
        res.json(response.data);
    } catch (error: any) {
        console.error("❌ Error fetching location from Geocoding API:", error.response?.data || error);
        res.status(500).json({ error: "Failed to fetch location" });
    }
});
  
  // 📍 Get Place Details (Address & Coordinates)
  router.get("/details", async (req: Request<{}, {}, {}, DetailsQuery>, res: Response) => {
    const { placeId } = req.query;
  
    if (!placeId) {
       res.status(400).json({ error: "placeId parameter is required" });
       return;
    }
  
    console.log(`📌 Received place details request for: ${placeId}`);
    console.log(`🚀 Using API Key: ${GOOGLE_MAPS_API_KEY}`);
  
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_API_KEY,
            fields: "formatted_address,geometry",
          },
        }
      );
  
      console.log("✅ Google API Response:", JSON.stringify(response.data, null, 2));
  
      res.json(response.data);
    } catch (error: any) {
      console.error("❌ Error fetching place details from Google:", error.response?.data || error);
      res.status(500).json({ error: "Failed to fetch place details" });
    }
  });

export default router;
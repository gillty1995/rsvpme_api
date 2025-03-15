"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.ensureUserExists = void 0;
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const User_1 = __importDefault(require("../models/User"));
const ensureUserExists = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const userId = req.user.sub;
        console.log("Ensuring user exists in database:", userId);
        let user = await User_1.default.findOne({ _id: userId });
        if (!user) {
            console.log(`User ${userId} does not exist. Creating...`);
            user = new User_1.default({
                _id: userId,
                email: req.user.email || "",
                name: req.user.name || "Anonymous",
                rsvpEvents: [],
            });
            await user.save();
        }
        return next(); // ✅ Explicitly return next() when done
    }
    catch (error) {
        console.error("Error in ensureUserExists middleware:", error);
        res.status(500).json({ message: "Server error in ensureUserExists." });
        return;
    }
};
exports.ensureUserExists = ensureUserExists;
// Set up JWKS (JSON Web Key Set) to get Auth0's public key for verifying the JWT
const jwksUri = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
const secret = jwks_rsa_1.default.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri,
});
const jwtCheck = (0, express_jwt_1.expressjwt)({
    secret,
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
    requestProperty: "auth", // Store decoded token in req.auth
});
// Middleware to verify the JWT
const verifyJWT = (req, res, next) => {
    console.log("Starting JWT verification...");
    console.log("Authorization Header:", req.headers.authorization);
    jwtCheck(req, res, (err) => {
        if (err) {
            console.error("JWT verification failed:", err);
            return res.status(401).json({ message: "Unauthorized, invalid token." });
        }
        // Explicitly cast req as AuthenticatedRequest to resolve TypeScript errors
        const authenticatedReq = req;
        console.log("Decoded Token Payload:", authenticatedReq.auth);
        if (!authenticatedReq.auth || !authenticatedReq.auth.sub) {
            console.error("Invalid JWT payload. 'sub' field is missing.");
            return res.status(401).json({ message: "JWT payload is incomplete." });
        }
        // Assign user data (ensure all properties are defined)
        authenticatedReq.user = {
            id: authenticatedReq.auth.sub,
            sub: authenticatedReq.auth.sub,
            userId: authenticatedReq.auth.sub,
            email: authenticatedReq.auth.email ?? "", // Ensure it's always a string
            name: authenticatedReq.auth.name ?? "", // Ensure it's always a string
        };
        console.log("User assigned to request:", authenticatedReq.user);
        return next();
    });
};
exports.verifyJWT = verifyJWT;

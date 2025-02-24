"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const express_jwt_1 = require("express-jwt"); // Import GetVerificationKey from express-jwt
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
// Set up JWKS (JSON Web Key Set) to get Auth0's public key for verifying the JWT
const jwksUri = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
// Dynamically fetch the public key from Auth0 using the JWKS endpoint
const secret = jwks_rsa_1.default.expressJwtSecret({
    jwksUri,
}); // Cast to GetVerificationKey from express-jwt
// Define the JWT middleware
const jwtCheck = (0, express_jwt_1.expressjwt)({
    secret, // Directly use the secret function (now typed correctly)
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
});
// Middleware to verify the JWT
const verifyJWT = (req, res, next) => {
    jwtCheck(req, res, next); // Call the middleware function correctly
};
exports.verifyJWT = verifyJWT;

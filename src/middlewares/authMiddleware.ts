// import express, { Request, Response, NextFunction } from "express";
// import { expressjwt, GetVerificationKey } from "express-jwt"; // Import GetVerificationKey from express-jwt
// import jwksRsa from "jwks-rsa";

// // Set up JWKS (JSON Web Key Set) to get Auth0's public key for verifying the JWT
// const jwksUri = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;

// // Dynamically fetch the public key from Auth0 using the JWKS endpoint
// const secret = jwksRsa.expressJwtSecret({
//   jwksUri,
// }) as unknown as GetVerificationKey; // Cast to GetVerificationKey from express-jwt

// // Define the JWT middleware
// const jwtCheck = expressjwt({
//   secret,  // Directly use the secret function (now typed correctly)
//   audience: process.env.AUTH0_AUDIENCE,
//   issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//   algorithms: ["RS256"],
// });

// // Middleware to verify the JWT
// export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
//   console.log("JWT Verified, User:", req.user);
//   try {
//     jwtCheck(req, res, next);
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized, invalid token." });
//   }
// };

import express, { Request, Response, NextFunction } from "express";
import { expressjwt, GetVerificationKey } from "express-jwt"; // Import GetVerificationKey from express-jwt
import jwksRsa from "jwks-rsa";

// Set up JWKS (JSON Web Key Set) to get Auth0's public key for verifying the JWT
const jwksUri = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;

// Dynamically fetch the public key from Auth0 using the JWKS endpoint
const secret = jwksRsa.expressJwtSecret({
  jwksUri,
}) as unknown as GetVerificationKey; // Cast to GetVerificationKey from express-jwt

// Define the JWT middleware
const jwtCheck = expressjwt({
  secret,  // Directly use the secret function (now typed correctly)
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Middleware to verify the JWT
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  console.log("Starting JWT verification...");

  jwtCheck(req, res, (err) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Unauthorized, invalid token." });
    }
    
    console.log("JWT Verified, User:", req.user);

    // Log the user object to ensure it's correctly populated
    if (req.user) {
      console.log("Decoded User Information: ", req.user);
    }

    // Ensure the user has the 'sub' property in the JWT
    if (req.user && req.user.sub) {
      req.user.userId = req.user.sub;  // Store userId for convenience
      console.log("User ID found and added to request:", req.user.userId);
      return next();
    }

    console.error("User ID not found in token");
    return res.status(401).json({ message: "User ID not found in token" });
  });
};
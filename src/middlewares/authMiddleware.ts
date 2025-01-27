// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";


// const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";


// export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
    
//     res.status(401).json({ message: "Access denied. No token provided." });
//     return; 
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string };
//     req.user = decoded; 
//     next(); 
//   } catch (error) {
 
//     res.status(400).json({ message: "Invalid token" });
//     return; 
//   }
// };

import express, { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";  // Correct import for JWT middleware
import jwksRsa from "jwks-rsa";

// Set up JWKS (JSON Web Key Set) to get Auth0's public key for verifying the JWT
const jwksUri = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;

// Dynamically fetch the public key from Auth0 using the JWKS endpoint
const secret = jwksRsa.expressJwtSecret({
  jwksUri,
});

// Define the JWT middleware
const jwtCheck = expressjwt({
  secret: secret as unknown as string,  // Cast it as string to match the type expected by express-jwt
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Middleware to verify the JWT
export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  jwtCheck(req, res, next);
};
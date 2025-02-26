import { Request, Response, NextFunction } from "express";
import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksRsa from "jwks-rsa";

// Define Authenticated User Interface
interface AuthenticatedUser {
  sub: string; // Auth0 user ID (Always required)
  email?: string;
  name?: string;
}

// Extend Request type to include 'auth' and 'user'
interface AuthenticatedRequest extends Request {
  auth?: AuthenticatedUser; // Auth0 token payload
  user: {
    id: string;
    sub: string;
    userId: string;
    email: string;
    name: string;
  };
}

// Set up JWKS (JSON Web Key Set) to get Auth0's public key for verifying the JWT
const jwksUri = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;

const secret = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksUri,
}) as unknown as GetVerificationKey;

const jwtCheck = expressjwt({
  secret,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  requestProperty: "auth", // Store decoded token in req.auth
});

// Middleware to verify the JWT
export const verifyJWT = (
  req: Request, // Keep Express Request type here
  res: Response,
  next: NextFunction
) => {
  console.log("Starting JWT verification...");
  console.log("Authorization Header:", req.headers.authorization);

  jwtCheck(req, res, (err) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Unauthorized, invalid token." });
    }

    // Explicitly cast req as AuthenticatedRequest to resolve TypeScript errors
    const authenticatedReq = req as AuthenticatedRequest;

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
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";


export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    
    res.status(401).json({ message: "Access denied. No token provided." });
    return; 
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string };
    req.user = decoded; 
    next(); 
  } catch (error) {
 
    res.status(400).json({ message: "Invalid token" });
    return; 
  }
};
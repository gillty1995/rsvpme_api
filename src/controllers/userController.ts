import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

// Register a new user
export const registerUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, avatar } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const newUser = new User({
      email,
      password,
      name,
      avatar,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate JWT (optional, for local use)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "1d" });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error registering user", error: errorMessage });
  }
};

// Log in a user (uses Auth0 token)
export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure req.user is defined and has an email property
    if (!req.user || !req.user.email) {
       res.status(401).json({ message: "Unauthorized, no user information found." });
       return;
    }

    const { email } = req.user;

    // Find the user in your database by email
    const user = await User.findOne({ email });
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error logging in", error: errorMessage });
  }
};
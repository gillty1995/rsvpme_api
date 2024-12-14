import { Request, Response, RequestHandler } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

// Register a User
export const registerUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Create new user (password will be hashed automatically by the pre-save hook in the schema)
    const newUser = new User({ name, email, password });
    await newUser.save(); // Save to database

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error registering user", error: errorMessage });
  }
};

// Login a User
export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log("Received email:", email);
    console.log("Received password:", password);

    // Find user by email and select password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found");
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    console.log("User found:", user);

    // Validate password using the model's method
    const isPasswordValid = await user.isValidPassword(password);
    console.log("Password valid:", isPasswordValid); // Log the result of password comparison

    if (!isPasswordValid) {
      console.log("Invalid password");
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    console.log("Generated Token:", token);

    res.status(200).json({ message: "Login successful", token });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error logging in", error: errorMessage });
  }
};

// Get User Profile
export const getUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; 
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error fetching user profile", error: errorMessage });
  }
};

// Update User Details
export const updateUserDetails: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; 
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: "Error updating user", error: errorMessage });
  }
};
// import { Request, Response, RequestHandler } from "express";
// import jwt from "jsonwebtoken"; // JWT for authentication
// import User from "../models/User";
// import { IUser } from "../models/User";

// // Register a User
// export const registerUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res.status(409).json({ message: "User already exists" });
//       return;
//     }

//     const newUser = new User({ name, email, password });
//     await newUser.save(); 

//     res.status(201).json({ message: "User registered successfully", user: newUser });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ message: "Error registering user", error: errorMessage });
//   }
// };

// // Login a User
// export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       res.status(401).json({ message: "Invalid email or password" });
//       return;
//     }

//     const isPasswordValid = await user.isValidPassword(password);

//     if (!isPasswordValid) {
//       res.status(401).json({ message: "Invalid email or password" });
//       return;
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "1d" });

//     res.status(200).json({ message: "Login successful", token });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ message: "Error logging in", error: errorMessage });
//   }
// };

// // Get User Profile
// export const getUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id; // Assuming req.user is set by JWT middleware
//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json(user);
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ message: "Error fetching user profile", error: errorMessage });
//   }
// };

// // Update User Details
// export const updateUserDetails: RequestHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const { name } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { name },
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!updatedUser) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json({ message: "User updated successfully", user: updatedUser });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ message: "Error updating user", error: errorMessage });
//   }
// };

// // Add Event to User's RSVP list
// export const addEventToUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const { eventId } = req.body; // Event ID being passed to the user

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     user.events?.push(eventId); // Add the event ID to the user's events array
//     await user.save();

//     res.status(200).json({ message: "Event added to your RSVP list", events: user.events });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ message: "Error adding event to RSVP list", error: errorMessage });
//   }
// };

// // Logout a User
// export const logoutUser: RequestHandler = (req: Request, res: Response): void => {
//   try {
//     // Simply inform the client to clear their JWT from local storage
//     res.status(200).json({ message: "Logout successful" });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     res.status(500).json({ message: "Error logging out", error: errorMessage });
//   }
// };

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
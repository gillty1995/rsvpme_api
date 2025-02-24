"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDetails = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
// Register a User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        // Create new user (password will be hashed automatically by the pre-save hook in the schema)
        const newUser = new User_1.default({ name, email, password });
        await newUser.save(); // Save to database
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error registering user", error: errorMessage });
    }
};
exports.registerUser = registerUser;
// Login a User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Received email:", email);
        console.log("Received password:", password);
        // Find user by email and select password field
        const user = await User_1.default.findOne({ email }).select("+password");
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
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        console.log("Generated Token:", token);
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error logging in", error: errorMessage });
    }
};
exports.loginUser = loginUser;
// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User_1.default.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error fetching user profile", error: errorMessage });
    }
};
exports.getUserProfile = getUserProfile;
// Update User Details
const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name } = req.body;
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { name }, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error updating user", error: errorMessage });
    }
};
exports.updateUserDetails = updateUserDetails;

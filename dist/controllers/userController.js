"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Register a new user
const registerUser = async (req, res) => {
    try {
        const { email, password, name, avatar } = req.body;
        // Check if the user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const newUser = new User_1.default({
            email,
            password,
            name,
            avatar,
        });
        // Save the new user to the database
        await newUser.save();
        // Generate JWT (optional, for local use)
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "1d" });
        res.status(201).json({ message: "User created successfully", token });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error registering user", error: errorMessage });
    }
};
exports.registerUser = registerUser;
// Log in a user (uses Auth0 token)
const loginUser = async (req, res) => {
    try {
        // Ensure req.user is defined and has an email property
        if (!req.user || !req.user.email) {
            res.status(401).json({ message: "Unauthorized, no user information found." });
            return;
        }
        const { email } = req.user;
        // Find the user in your database by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "Login successful", user });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: "Error logging in", error: errorMessage });
    }
};
exports.loginUser = loginUser;

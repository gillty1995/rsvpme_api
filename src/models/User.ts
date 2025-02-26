// import mongoose, { Document, Schema, Model } from "mongoose";
// import bcrypt from "bcryptjs";

// // Interface for User Document
// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   events?: mongoose.Types.ObjectId[]; // Reference to Event objects (RSVPs)
//   isValidPassword(password: string): Promise<boolean>;
// }

// // User Schema
// const UserSchema: Schema<IUser> = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       minlength: [2, "Name must be at least 2 characters long"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       trim: true,
//       lowercase: true,
//       validate: {
//         validator: function (value: string) {
//           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//         },
//         message: "Invalid email format",
//       },
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters long"],
//       select: false, // Hide password by default
//     },
//     events: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Event", // Reference to Event (RSVP)
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Hash password before saving user
// UserSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) return next(); 
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err as Error);
//   }
// });

// // Method to validate password
// UserSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
//   return bcrypt.compare(password, this.password);
// };

// // Create User model
// const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

// export default User;

import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// User Schema Interface
interface IUser extends Document {
  email?: string; // Changed from required to optional
  password?: string; // Optional for users authenticated via OAuth
  name?: string; // Changed from required to optional
  avatar?: string; // Changed from required to optional
  isValidPassword?(password: string): Promise<boolean>;
}

// User Schema Definition
const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, sparse: true }, // 'sparse' allows multiple documents without email
  password: { type: String, select: false },
  name: { type: String },
  avatar: { type: String },
});

// Hash the password before saving the user
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

// Check if the entered password is correct
userSchema.methods.isValidPassword = async function (password: string) {
  return this.password ? bcrypt.compare(password, this.password) : false;
};

const User = model<IUser>("User", userSchema);

export default User;
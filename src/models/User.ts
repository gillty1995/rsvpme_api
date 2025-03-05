import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// User Schema Interface
interface IUser extends Document {
  _id: string;
  email?: string; // Changed from required to optional
  password?: string; // Optional for users authenticated via OAuth
  name?: string; // Changed from required to optional
  avatar?: string; // Changed from required to optional
  isValidPassword?(password: string): Promise<boolean>;
  rsvpEvents: mongoose.Types.ObjectId[];
}

// User Schema Definition
const userSchema = new Schema<IUser>({
  _id: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // 'sparse' allows multiple documents without email
  password: { type: String, select: false },
  name: { type: String },
  avatar: { type: String },
  rsvpEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
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
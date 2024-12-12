import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_2fa: { type: Boolean, default: false },
  verificationCode: { type: String, default: "" },
});

export const User = mongoose.model("User", userSchema);

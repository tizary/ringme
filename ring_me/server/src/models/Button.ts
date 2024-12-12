import mongoose from "mongoose";

const buttonSchema = new mongoose.Schema({
  button_name: { type: String, required: true },
  button_message: { type: String, required: true },
  button_color: { type: String, required: true },
});

export const Button = mongoose.model("Button", buttonSchema);

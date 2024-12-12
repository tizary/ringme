import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  tables: [
    {
      establishment_id: String,
      table_number: String,
      enabled: Boolean,
    },
  ],
  calls: [
    {
      table_number: String,
      message: [String],
    },
  ],
});

export const Staff = mongoose.model("Staff", staffSchema);

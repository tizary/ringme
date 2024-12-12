import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  establishment_id: { type: String, required: true },
  table_number: { type: String, required: true },
  qrcode_text: { type: String, required: true },
});

export const Table = mongoose.model("Table", tableSchema);

import mongoose from "mongoose";

const tableAdminSchema = new mongoose.Schema({
  establishment_id: { type: String, required: true },
  table_number: { type: String, required: true },
  qrcode_text: { type: String, required: true },
})

export const TableAdmin = mongoose.model("TableAdmin", tableAdminSchema);
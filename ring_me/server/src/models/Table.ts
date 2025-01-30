import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  admin_id: { type: String, required: true },
  establishments: [{
    establishment_id: { type: String, required: true },
    establishment_name: {type: String, required: true},
    tables: [{
      table_id: { type: String, required: true },
      table_number: { type: String, required: true },
      qrcode_text: { type: String, required: true },}
    ]}
  ]
});

export const Table = mongoose.model("Table", tableSchema);

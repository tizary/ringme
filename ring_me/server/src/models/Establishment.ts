import mongoose from "mongoose";

const establishmentSchema = new mongoose.Schema({
  establishment_name: { type: String, required: true },
  description: { type: String },
  instagram_link: { type: String },
  tiktok_link: { type: String },
  tables: [
    {
      table_number: { type: String },
      qrcode_text: { type: String },
    },
  ],
  buttons: [
    {
      button_name: { type: String },
      button_message: { type: String },
      button_color: { type: String },
    },
  ],
  menu: {
    establishment_id: { type: String },
    link: { type: String },
    file: { type: String },
  },
});

export const Establishment = mongoose.model(
  "Establishment",
  establishmentSchema
);

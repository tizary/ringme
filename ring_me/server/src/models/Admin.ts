import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean },
  emailConfirmed: { type: Boolean, default: false },
  emailToken: { type: String },
  colors: [
    {
      id_color: String,
      color: String,
    },
  ],
  establishments: [
    {
      establishment_id: String,
      establishment_name: String,
      description: String,
      instagram_link: String,
      tiktok_link: String,
      image: Buffer,
      tables: [
        {
          establishment_id: String,
          table_number: String,
          qrcode_text: String,
        },
      ],
      buttons: [
        {
          establishment_id: String,
          button_name: String,
          button_message: String,
          button_color: String,
        },
      ],
      menu: {
        establishment_id: String,
        link: String,
        file: String
      },
    },
  ],
  staff: [
    {
      id_staff: String,
      email: String,
      username: String,
      password: String,
      image: Buffer,
      emailConfirmed: { type: Boolean, default: false },
      emailToken: { type: String },
      tables: [
        {
          establishment_id: String,
          establishment_name: String,
          table_number: String,
          enabled: Boolean,
        },
      ],
    },
  ],
});

export const Admin = mongoose.model("Admin", adminSchema);

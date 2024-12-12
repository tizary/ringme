import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import mongoose from "mongoose";
import { Establishment } from "../models/Establishment";

export const createEstablishment = async (req: Request, res: Response) => {
  try {
    const {
      adminId,
      establishment_name,
      description,
      instagram_link,
      tiktok_link,
    } = req.body;
    console.log("adminId", adminId);

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const newEstablishment = new Establishment({
      establishment_name,
      description,
      instagram_link,
      tiktok_link,
      tables: [],
      buttons: [],
      menu: { link: "", file: "" },
    });
    await newEstablishment.save();
    admin.establishments.push(newEstablishment);
    await admin.save();

    res
      .status(201)
      .json({
        message: "Establishment created",
        establishment: newEstablishment,
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating establishment", error });
  }
};

export const deleteEstablishment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await Admin.updateMany(
      { "establishments._id": id },
      { $pull: { establishments: { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Establishment not found in any admin" });
    }

    res
      .status(200)
      .json({ message: "Establishment deleted from all admins successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting establishment", error });
  }
};

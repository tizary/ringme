import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import * as path from 'path';

export const addMenuLink = async (req: Request, res: Response) => {
  try {
    const { establishment_id, link} = req.body;

    const admin = await Admin.findOne({
      "establishments._id": establishment_id,
    });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment)
      return res.status(404).json({ message: "Establishment not found" });

    establishment.menu = { establishment_id, link };

    await admin.save();

    res
      .status(201)
      .json({ message: "Menu link added successfully", menu: establishment.menu });
  } catch (error) {
    res.status(500).json({ message: "Error adding menu", error });
  }
};

export const addMenuFile = async (req: Request, res: Response) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { establishment_id } = req.body;

    const admin = await Admin.findOne({
      "establishments._id": establishment_id,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment) {
      return res.status(404).json({ message: "Establishment not found" });
    }

    establishment.menu = {
      establishment_id,
      file: req.file.filename,
    };

    await admin.save();

    res.status(201).json({
      message: "Menu file uploaded successfully",
      menu: establishment.menu
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: "Error uploading menu file", error });
  }
};

export const getMenuFile = async (req: Request, res: Response) => {
  try {
    const { establishment_id } = req.params;
    const admin = await Admin.findOne({
      "establishments._id": establishment_id,
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment || !establishment.menu?.file) {
      return res.status(404).json({ message: "Menu file not found" });
    }

    const filePath = path.join(__dirname, '../../uploads', establishment.menu.file);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: "Error getting menu file", error });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await Admin.updateMany(
      { "establishments._id": id },
      { $unset: { "establishments.$.menu": "" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Establishment not found" });
    }

    res
      .status(200)
      .json({ message: "Menu deleted from all establishments successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu", error });
  }
};

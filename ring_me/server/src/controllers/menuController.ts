import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import * as path from 'path';
import fs from 'fs';

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

      if (establishment.menu?.file) {
      const oldFilePath = path.join(__dirname, '../../uploads', establishment.menu.file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log(`Deleted old file: ${establishment.menu.file}`);
      }
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

  const admin = await Admin.findOne({
      "establishments._id": id,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const establishment = admin.establishments.id(id);
    if (!establishment || !establishment.menu) {
      return res.status(404).json({ message: "Establishment not found or no menu exists" });
    }

    if (establishment.menu.file) {
      const filePath = path.join(__dirname, '../../uploads', establishment.menu.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${establishment.menu.file}`);
      }
    }

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

export const editMenu = async (req: Request, res: Response) => {
  try {
    const  { id } = req.params;
    const { link } = req.body;
    const newFile = req.file;

     console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    console.log("Extracted link:", link);

    const admin = await Admin.findOne({
      "establishments._id": id,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const establishment = admin.establishments.id(id);
    if (!establishment) {
      return res.status(404).json({ message: "Establishment not found" });
    }

    if (establishment.menu?.file) {
      const oldFilePath = path.join(__dirname, '../../uploads', establishment.menu.file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log(`Deleted old file: ${establishment.menu.file}`);
      }
    }

      if (newFile) {
      establishment.menu = {
        establishment_id: id,
        file: newFile.filename
      };
    } else if (link) {
      establishment.menu = {
        establishment_id: id,
        link
      };
    } else {
      return res.status(400).json({ message: "No valid data for menu update provided" });
    }

    await admin.save();

    res.status(200).json({
      message: "Menu updated successfully",
      menu: establishment.menu,
    });
  } catch (error) {
    console.error('Edit menu error:', error);
    res.status(500).json({ message: "Error editing menu", error });
  }
};
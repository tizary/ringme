import { Request, Response } from "express";
import { Admin } from "../models/Admin";

export const addMenu = async (req: Request, res: Response) => {
  try {
    const { establishment_id, link, file } = req.body;

    const admin = await Admin.findOne({
      "establishments._id": establishment_id,
    });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment)
      return res.status(404).json({ message: "Establishment not found" });

    establishment.menu = { establishment_id, link, file };

    await admin.save();

    res
      .status(201)
      .json({ message: "Menu added successfully", menu: establishment.menu });
  } catch (error) {
    res.status(500).json({ message: "Error adding menu", error });
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

import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Button } from "../models/Button";

export const createButton = async (req: Request, res: Response) => {
  try {
    const {
      adminId,
      establishment_id,
      button_name,
      button_message,
      button_color,
    } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment)
      return res.status(404).json({ message: "Establishment not found" });

    const newButton = new Button({
      button_name,
      button_message,
      button_color,
    });

    establishment.buttons.push(newButton);

    await admin.save();

    res.status(201).json({ message: "Button created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating button", error });
  }
};

export const deleteButton = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const result = await Admin.updateMany(
      { "establishments.buttons._id": id },
      { $pull: { "establishments.$.buttons": { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Button not found in any establishment" });
    }

    res
      .status(200)
      .json({ message: "Button deleted from all establishments successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting button", error });
  }
};

export const updateButton = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { establishment_id, button_name, button_message, button_color } =
      req.body;

    const admin = await Admin.findOne({ "establishments.buttons._id": id });
    if (!admin)
      return res.status(404).json({
        message: "Admin not found or Button not found in any establishment",
      });

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment)
      return res.status(404).json({ message: "Establishment not found" });

    const button = establishment.buttons.id(id);
    if (!button) return res.status(404).json({ message: "Button not found" });

    button.button_name = button_name || button.button_name;
    button.button_message = button_message || button.button_message;
    button.button_color = button_color || button.button_color;

    await admin.save();

    res.status(200).json({ message: "Button updated successfully", button });
  } catch (error) {
    res.status(500).json({ message: "Error updating button", error });
  }
};

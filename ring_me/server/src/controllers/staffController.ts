import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Staff } from "../models/Staff";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { adminId, email, username, password, tables } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const newStaff = new Staff({
      email,
      username,
      password,
      tables: tables || [],
      calls: [],
      admin: false,
    });

    admin.staff.push(newStaff);

    await admin.save();

    res
      .status(201)
      .json({ message: "Staff created successfully", staff: newStaff });
  } catch (error) {
    res.status(500).json({ message: "Error creating staff", error });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await Admin.updateMany(
      { "staff._id": id },
      { $pull: { staff: { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Staff not found in any admin" });
    }

    res
      .status(200)
      .json({ message: "Staff deleted from all admins successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error });
  }
};

export const editStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, username, password } = req.body;

    const updateFields: any = {};

    if (email) updateFields["staff.$.email"] = email;
    if (username) updateFields["staff.$.username"] = username;
    if (password) updateFields["staff.$.password"] = password;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const result = await Admin.updateOne(
      { "staff._id": id },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff", error });
  }
};

export const selectTables = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tables } = req.body;
    if (!tables) {
      return res.status(400).json({ message: "No tables data provided" });
    }

    if (!Array.isArray(JSON.parse(tables))) {
      return res.status(400).json({ message: "Tables data must be an array" });
    }

    const result = await Admin.updateOne(
      { "staff._id": id },
      { $set: { "staff.$.tables": JSON.parse(tables) } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Staff not found or no changes made" });
    }

    res.status(200).json({ message: "Staff tables updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff tables", error });
  }
};

export const getStaff = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId).populate('staff');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ staff: admin.staff });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving staff", error });
  }
};
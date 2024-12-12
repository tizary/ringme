import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Staff } from "../models/Staff";
import { Table } from "../models/Table";

export const createTable = async (req: Request, res: Response) => {
  try {
    const { adminId, establishment_id, table_number, qrcode_text } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment)
      return res.status(404).json({ message: "Establishment not found" });

    const newTable = new Table({
      establishment_id,
      table_number,
      qrcode_text,
    });

    establishment.tables.push(newTable);

    await admin.save();

    res.status(201).json({ message: "Table created", table: newTable });
  } catch (error) {
    res.status(500).json({ message: "Error creating table", error });
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const resultAdmin = await Admin.updateMany(
      { "establishments.tables._id": id },
      { $pull: { "establishments.$.tables": { _id: id } } }
    );

    const resultStaff = await Staff.updateMany(
      { "tables._id": id },
      { $pull: { tables: { _id: id } } }
    );

    if (resultAdmin.modifiedCount === 0 && resultStaff.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Table not found in any establishment or staff" });
    }

    res.status(200).json({
      message: "Table deleted from all establishments and staff successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting table", error });
  }
};

export const updateTable = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { establishment_id, table_number, qrcode_text } = req.body;

  try {
    const adminUpdateResult = await Admin.updateMany(
      { "establishments.tables._id": id },
      {
        $set: {
          "establishments.$[estab].tables.$[table].table_number": table_number,
          "establishments.$[estab].tables.$[table].qrcode_text": qrcode_text,
        },
      },
      {
        arrayFilters: [{ "estab.tables._id": id }, { "table._id": id }],
        new: true,
      }
    );

    if (adminUpdateResult.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Table not found in any establishment" });
    }

    res.status(200).json({ message: "Table updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating table", error });
  }
};

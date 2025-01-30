import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Staff } from "../models/Staff";
import { Table } from "../models/Table";
import { TableAdmin } from "../models/TableAdmin";

export const createTable = async (req: Request, res: Response) => {
  try {
    const { adminId, establishment_id, establishment_name, table_number, qrcode_text } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const establishment = admin.establishments.id(establishment_id);
    if (!establishment)
      return res.status(404).json({ message: "Establishment not found" });

    const newTable = new TableAdmin({
      establishment_id,
      table_number,
      qrcode_text,
    });

    establishment.tables.push(newTable);

    await admin.save();

    let tableEntry = await Table.findOne({ admin_id: adminId });

    if (tableEntry) {

      const existingEstablishment = tableEntry.establishments.find(
        est => est.establishment_id.toString() === establishment_id
      );

      if (existingEstablishment) {

        existingEstablishment.tables.push({
          table_id: newTable._id,
          table_number,
          qrcode_text,
        });
      } else {

        tableEntry.establishments.push({
          establishment_id,
          establishment_name,
          tables: [{
            table_id: newTable._id,
            table_number,
            qrcode_text,
          }],
        });
      }

      await tableEntry.save();
    } else {

      tableEntry = new Table({
        admin_id: adminId,
        establishments: [
          {
            establishment_id,
            establishment_name,
            tables: [
              {
                table_id: newTable._id,
                table_number,
                qrcode_text,
              },
            ],
          },
        ],
      });
      await tableEntry.save();
    }

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

    const resultTable = await Table.updateMany(
      { "establishments.tables.table_id": id },
      { $pull: { "establishments.$.tables": { table_id: id } } }
    );

    await Table.updateMany(
      { "establishments.tables": { $size: 0 } },
      { $pull: { establishments: { tables: { $size: 0 } } } }
    );

    if (resultAdmin.modifiedCount === 0 &&
        resultStaff.modifiedCount === 0 &&
        resultTable.modifiedCount === 0) {
      return res.status(404).json({
        message: "Table not found in any collection"
      });
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

    const tableUpdateResult = await Table.updateMany(
      { "establishments.tables.table_id": id },
      {
        $set: {
          "establishments.$[estab].tables.$[table].table_number": table_number,
          "establishments.$[estab].tables.$[table].qrcode_text": qrcode_text,
        },
      },
      {
        arrayFilters: [
          { "estab.tables.table_id": id },
          { "table.table_id": id }
        ],
        new: true,
      }
    );


    if (adminUpdateResult.matchedCount === 0 &&
        tableUpdateResult.matchedCount === 0) {
      return res.status(404).json({
        message: "Table not found in any collection"
      });
    }

    res.status(200).json({ message: "Table updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating table", error });
  }
};

export const getTablesByAdminId = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;

    const tableData = await Table.findOne({ admin_id: adminId });

    if (!tableData) {
      return res.status(404).json({ message: "No tables found for this admin" });
    }

    res.status(200).json( tableData.establishments );

  } catch (error) {
    res.status(500).json({ message: "Error retrieving tables", error });
  }
};
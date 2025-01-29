import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Staff } from "../models/Staff";
import crypto from "crypto";
import transporter from "../emailService";
import { error, log } from "console";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { adminId, email, username, password, tables, image_str } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Генерация токена подтверждения
    const emailToken = crypto.randomBytes(32).toString("hex");

    const image = image_str ? Buffer.from(image_str, 'base64') : null;


    const newStaff = {
      email,
      username,
      password,
      emailConfirmed: false,
      emailToken,
      tables: tables || [],
      calls: [],
      admin: false,
      image,
    };

    const confirmationUrl = `${process.env.SERVER_URL}/api/staffs/confirm-email?token=${emailToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Подтверждение электронной почты",
      html: `<p>Пожалуйста, подтвердите вашу электронную почту, перейдя по ссылке:</p>
             <a href="${confirmationUrl}">${confirmationUrl}</a>`,
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

export const confirmStaffEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const admin = await Admin.findOne({ "staff.emailToken": token });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const staffMember = admin.staff.find((staff) => staff.emailToken === token);

    if (!staffMember) {
      return res.status(400).json({ message: "Invalid or expired token", error: error });
    }

    staffMember.emailConfirmed = true;
    staffMember.emailToken = undefined;

    await admin.save();

    res.status(200).json({ message: "Staff email confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error confirming staff email", error });
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
    const { email, username, password, image_str } = req.body;

    const image = image_str ? Buffer.from(image_str, 'base64') : null;
    const updateFields: any = {};

    if (email) updateFields["staff.$.email"] = email;
    if (username) updateFields["staff.$.username"] = username;
    if (password) updateFields["staff.$.password"] = password;
    if (image_str) updateFields["staff.$.image"] = image;

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

    // if (!Array.isArray(JSON.parse(tables))) {
    //   return res.status(400).json({ message: "Tables data must be an array" });
    // }

    const result = await Admin.updateOne(
      { "staff._id": id },
      { $set: { "staff.$.tables": tables } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Staff not found or no changes made" });
    }

    res.status(200).json({ message: "Staff tables updated successfully" });
  } catch (error) {
    console.log(error)
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

    const staffWithBase64Images = admin.staff.map((staffMember) => {
      let base64Image = '';
      if (staffMember.image) {
        base64Image = staffMember.image.toString('base64');
      }
      return { ...staffMember.toObject(), image: base64Image };
    });

    res.status(200).json(staffWithBase64Images);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving staff", error });
  }
};
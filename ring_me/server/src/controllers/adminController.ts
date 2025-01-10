import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { jwtSecret } from "../config";
import jwt from "jsonwebtoken";

export const createAdmin = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const newAdmin = new Admin({
      email,
      username,
      password,
      admin: true,
      colors: [],
      establishments: [],
      staff: [],
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", adminId: newAdmin._id });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Admin creation failed", error: error.message });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) {

      const isMatch = password === admin.password;
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: admin._id, userType: "admin" }, jwtSecret as string, {
        expiresIn: "1h",
      });

      const adminData = admin.toObject();

      return res.json({ token, user: adminData, userType: "admin" });
    }

    const allAdmins = await Admin.find();
    const staff = allAdmins
      .flatMap((admin) => admin.staff)
      .find((staffMember) => staffMember.email === email);

    if (!staff) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = password === staff.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: staff._id, userType: "staff" }, jwtSecret as string, {
      expiresIn: "1h",
    });

    return res.json({ token, user: staff, userType: "staff" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  try {

    const adminId = (req as any).user.id;

    const admin = await Admin.findById(adminId)
      .select('-password');

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const establishmentsWithBase64Image = admin.establishments.map(est => ({
      ...est.toObject(),
      image: est.image ? est.image.toString('base64') : ''
    }));
    return res.json({
      _id: admin._id,
      email: admin.email,
      username: admin.username,
      admin: admin.admin,
      establishments: establishmentsWithBase64Image,
      staff: admin.staff,
      colors: admin.colors
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching admin profile",
      error: error.message
    });
  }
};
import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { jwtSecret } from "../config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../emailService";

export const createAdmin = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already in use" });
    }
     // Генерация токена подтверждения
    const emailToken = crypto.randomBytes(32).toString("hex");

    const newAdmin = new Admin({
      email,
      username,
      password,
      admin: true,
      emailConfirmed: false,
      emailToken,
      colors: [],
      establishments: [],
      staff: [],
    });

    const confirmationUrl = `${process.env.SERVER_URL}/api/admin/confirm-email?token=${emailToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Подтверждение электронной почты",
      html: `<p>Пожалуйста, подтвердите вашу электронную почту, перейдя по ссылке:</p>
             <a href="${confirmationUrl}">${confirmationUrl}</a>`,
    });

    await newAdmin.save();
    res
      .status(201)
      .json({
      message: "Admin registered successfully. Please confirm your email to activate your account.",
    });
      // .json({ message: "Admin created successfully", adminId: newAdmin._id });

  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Admin creation failed", error: error.message });
  }
};

export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const admin = await Admin.findOne({ emailToken: token });
    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    admin.emailConfirmed = true;
    admin.emailToken = undefined;
    await admin.save();

    res.status(200).json({ message: "Email confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error confirming email", error });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });

    if (admin) {

      if (!admin.emailConfirmed) {
        return res.status(400).json({ message: "Please confirm your email before logging in" });
      }

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

    if (!staff.emailConfirmed) {
      return res.status(400).json({ message: "Please confirm your email before logging in" });
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
      .select('-password -emailToken -emailConfirmed');

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const establishments = admin.establishments.map(est => ({
      _id: est._id,
      establishment_name: est.establishment_name,
    }));
    return res.json(establishments);

  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching admin profile",
      error: error.message
    });
  }
};
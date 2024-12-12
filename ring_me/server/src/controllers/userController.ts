import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret, smtpEmail, smtpPassword } from "../config";
import { User } from "../models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: smtpEmail,
    pass: smtpPassword,
  },
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const newUser = new User({
      email,
      password,
      username,
      is_2fa: false,
      verificationCode: "",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, jwtSecret as string, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = password === user.password;
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, jwtSecret as string, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, "your_jwt_secret") as { id: string };
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (current_password !== user.password)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = new_password;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};

export const verify = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(req.body);
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.is_2fa = true;
    user.verificationCode = "";
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const sendCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const verificationCode = crypto.randomBytes(4).toString("hex");
    user.verificationCode = verificationCode;
    await user.save();

    await transporter.sendMail({
      from: smtpEmail,
      to: email,
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}`,
    });

    res.json({ message: "New verification code sent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to resend verification code" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();
    if (user) {
      return res.status(200).json(user);
    }
    res.status(404).json({ message: "User not found" });
  } catch (error: any) {
    console.error("Get user failed:", error);
    res.status(500).json({ message: "Get user failed", error: error.message });
  }
};

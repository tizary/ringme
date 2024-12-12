import express from "express";
import {
  register,
  login,
  changePassword,
  verify,
  sendCode,
  getUser,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const userRouter = express.Router();

userRouter.post("/registration", register);
userRouter.post("/login", login);

userRouter.get("/user/:id", authenticateToken, getUser);

userRouter.put("/send-code", authenticateToken, sendCode);
userRouter.put("/verify", authenticateToken, verify);
userRouter.put("/change-password", authenticateToken, changePassword);

export default userRouter;

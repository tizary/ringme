import { Router } from "express";
import { confirmEmail, createAdmin, getAdminProfile, loginAdmin } from "../controllers/adminController";
import { authenticateToken } from "../middlewares/authMiddleware";

const adminRouter = Router();

adminRouter.post("/create", createAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get('/profile', authenticateToken, getAdminProfile);
adminRouter.get("/confirm-email", confirmEmail);

export default adminRouter;

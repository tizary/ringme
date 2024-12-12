import { Router } from "express";
import { createAdmin, getAdminProfile, loginAdmin } from "../controllers/adminController";
import { authenticateToken } from "../middlewares/authMiddleware";

const adminRouter = Router();

adminRouter.post("/create", createAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get('/profile', authenticateToken, getAdminProfile);

export default adminRouter;

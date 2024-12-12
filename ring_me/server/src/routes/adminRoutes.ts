import { Router } from "express";
import { createAdmin, loginAdmin } from "../controllers/adminController";

const adminRouter = Router();

adminRouter.post("/create", createAdmin);
adminRouter.post("/login", loginAdmin);

export default adminRouter;

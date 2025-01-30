import { Router } from "express";
import {
  createStaff,
  deleteStaff,
  selectTables,
  editStaff,
  getStaff,
  confirmStaffEmail,
  getStaffById,
} from "../controllers/staffController";

const staffRouter = Router();

staffRouter.post("/create", createStaff);
staffRouter.get("/get/:adminId", getStaff);
staffRouter.delete("/delete/:id", deleteStaff);
staffRouter.put("/select-tables/:id", selectTables);
staffRouter.put("/edit/:id", editStaff);
staffRouter.get("/confirm-email", confirmStaffEmail);
staffRouter.get("/get-staff/:id", getStaffById);

export default staffRouter;

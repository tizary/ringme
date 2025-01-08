import { Router } from "express";
import {
  createStaff,
  deleteStaff,
  selectTables,
  editStaff,
  getStaff,
} from "../controllers/staffController";

const staffRouter = Router();

staffRouter.post("/create", createStaff);
staffRouter.get("/get/:adminId", getStaff);
staffRouter.delete("/delete/:id", deleteStaff);
staffRouter.put("/select-tables/:id", selectTables);
staffRouter.put("/edit/:id", editStaff);

export default staffRouter;

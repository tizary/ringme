import express from "express";
import {
  createTable,
  deleteTable,
  getTablesByAdminId,
  updateTable,
} from "../controllers/tableController";
import { authenticateToken } from "../middlewares/authMiddleware";

const tableRouter = express.Router();

tableRouter.post("/create", authenticateToken, createTable);
tableRouter.delete("/delete/:id", authenticateToken, deleteTable);
tableRouter.put("/edit/:id", authenticateToken, updateTable);
tableRouter.get("/get/:adminId", getTablesByAdminId);

export default tableRouter;

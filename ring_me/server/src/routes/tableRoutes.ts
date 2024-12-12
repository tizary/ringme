import express from "express";
import {
  createTable,
  deleteTable,
  updateTable,
} from "../controllers/tableController";
import { authenticateToken } from "../middlewares/authMiddleware";

const tableRouter = express.Router();

tableRouter.post("/create", authenticateToken, createTable);
tableRouter.delete("/delete/:id", authenticateToken, deleteTable);
tableRouter.put("/edit/:id", authenticateToken, updateTable);

export default tableRouter;

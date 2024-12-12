import express from "express";
import {
  createEstablishment,
  deleteEstablishment,
} from "../controllers/establishmentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const establishmentRouter = express.Router();

establishmentRouter.post("/create", authenticateToken, createEstablishment);
establishmentRouter.delete(
  "/delete/:id",
  authenticateToken,
  deleteEstablishment
);

export default establishmentRouter;

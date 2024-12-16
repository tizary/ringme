import express from "express";
import {
  createEstablishment,
  deleteEstablishment,
  getEstablishmentById,
} from "../controllers/establishmentController";
import { authenticateToken } from "../middlewares/authMiddleware";

const establishmentRouter = express.Router();

establishmentRouter.post("/create", authenticateToken, createEstablishment);
establishmentRouter.delete(
  "/delete/:id",
  authenticateToken,
  deleteEstablishment
);
establishmentRouter.get("/get/:id",  authenticateToken, getEstablishmentById);

export default establishmentRouter;

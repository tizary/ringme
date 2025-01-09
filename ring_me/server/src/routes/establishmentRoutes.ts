import express from "express";
import {
  createEstablishment,
  deleteEstablishment,
  editEstablishment,
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
establishmentRouter.put("/edit/:id",  authenticateToken, editEstablishment);

export default establishmentRouter;

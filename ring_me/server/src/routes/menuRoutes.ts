import express from "express";
import { addMenu, deleteMenu } from "../controllers/menuController";

const menuRouter = express.Router();

menuRouter.post("/create", addMenu);
menuRouter.delete("/delete/:id", deleteMenu);

export default menuRouter;

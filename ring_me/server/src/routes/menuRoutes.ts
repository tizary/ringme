import express from "express";
import { addMenuFile, addMenuLink, deleteMenu, editMenu, getMenuFile } from "../controllers/menuController";
import { upload } from '../middlewares/uploadMiddleware';

const menuRouter = express.Router();

menuRouter.post("/link", addMenuLink);
menuRouter.post("/file", upload.single('file'), addMenuFile);
menuRouter.get("/file/:establishment_id", getMenuFile);
menuRouter.delete("/delete/:id", deleteMenu);
menuRouter.put("/edit/:id", upload.single('file'),editMenu);

export default menuRouter;

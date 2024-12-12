import express from "express";
import {
  createButton,
  deleteButton,
  updateButton,
} from "../controllers/buttonController";

const buttonRouter = express.Router();

buttonRouter.post("/create", createButton);
buttonRouter.delete("/delete/:id", deleteButton);
buttonRouter.put("/edit/:id", updateButton);

export default buttonRouter;

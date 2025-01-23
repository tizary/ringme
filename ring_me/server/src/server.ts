import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { mongoURI } from "./config";
import userRoutes from "./routes/userRoutes";
import establishmentRoutes from "./routes/establishmentRoutes";
import tableRoutes from "./routes/tableRoutes";
import buttonRoutes from "./routes/buttonRoutes";
import menuRoutes from "./routes/menuRoutes";
import adminRoutes from "./routes/adminRoutes";
import staffRoutes from "./routes/staffRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import fs from 'fs';
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/establishments", establishmentRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/buttons", buttonRoutes);
app.use("/api/menu", menuRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

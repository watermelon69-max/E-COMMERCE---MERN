import express from "express";
import dotenv from "dotenv";

import cors from "cors";

import connectDb from "./config/db.js";

import authRoutes from "./route/authRoutes.js";

dotenv.config(); //using it for loading env var from .env file in process.env

const app = express();
app.use(express.json()); //for parsing json data in the request body
app.use(cors()); //for allowing cross-origin requests

app.get("/", (req, res) => {
  res.send(
    "hi my name is anurag mourya and i am  learning mern stack development",
  );
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

import express from "express";
import dotenv from "dotenv";

import cors from "cors";

dotenv.config(); //using it for loading env var from .env file in process.env

const app = express();
app.use(express.json()); //for parsing json data in the request body
app.use(cors()); //for allowing cross-origin requests

app.get("/", (req, res) => {
  res.send("hi my name is anurag mourya and i am  learning mern stack development");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


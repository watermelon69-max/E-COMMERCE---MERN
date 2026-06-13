import express from "express";

 // import {registerUser , loginUser , logOutUser } from 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/users", logOutUser);

export default router;

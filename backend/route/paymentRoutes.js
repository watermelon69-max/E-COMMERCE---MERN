import express from "express";

const router = express.Router();

router.post("/order", createdOrder);
router.post("/verify", verifyPayment);

export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import multer from "multer";
import upload from "../config/multer.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();
//all products
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);
//specific product
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);
export default router;

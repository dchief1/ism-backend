import { Router } from "express";
import ProductController from "../controllers/productController";
import protect from "../middlewares/authMiddleware";

const router = Router();

const { createProduct } = new ProductController()

router.post("/", protect, createProduct)

export default router;
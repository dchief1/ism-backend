import { Router } from "express";
import ProductController from "../controllers/productController";
import protect from "../middlewares/authMiddleware";
import { upload } from "../utils/fileUpload";

const router = Router();

const { createProduct } = new ProductController();

router.post("/", protect, upload.single("image"), createProduct);

export default router;

import { Router } from "express";
import ProductController from "../controllers/productController";
import protect from "../middlewares/authMiddleware";
import { upload } from "../utils/fileUpload";

const router = Router();

const { createProduct, getProducts, getProduct } = new ProductController();

router.post("/", protect, upload.single("image"), createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);

export default router;

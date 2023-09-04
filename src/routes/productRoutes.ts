import { Router } from "express";
import ProductController from "../controllers/productController";
import protect from "../middlewares/authMiddleware";
import { upload } from "../utils/fileUpload";

const router = Router();

const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } =
    new ProductController();

router.post("/", protect, upload.single("image"), createProduct);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, deleteProduct);

export default router;

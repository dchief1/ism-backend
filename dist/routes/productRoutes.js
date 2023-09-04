"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controllers/productController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const fileUpload_1 = require("../utils/fileUpload");
const router = (0, express_1.Router)();
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = new productController_1.default();
router.post("/", authMiddleware_1.default, fileUpload_1.upload.single("image"), createProduct);
router.patch("/:id", authMiddleware_1.default, fileUpload_1.upload.single("image"), updateProduct);
router.get("/", authMiddleware_1.default, getProducts);
router.get("/:id", authMiddleware_1.default, getProduct);
router.delete("/:id", authMiddleware_1.default, deleteProduct);
exports.default = router;

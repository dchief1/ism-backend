"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Product_1 = __importDefault(require("../models/Product"));
const fileUpload_1 = require("../utils/fileUpload");
// @ts-ignore
const cloudinary = __importStar(require("cloudinary/lib/v2"));
class ProductController {
    constructor() {
        // Create Product function
        this.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, sku, category, quantity, price, description } = req.body;
            // Validation
            if (!name ||
                !sku ||
                !category ||
                !quantity ||
                !price ||
                !description) {
                res.status(400);
                throw new Error("Please fill in all fields.");
            }
            // Handle Image upload
            let fileData = {};
            if (req.file) {
                // Save image to cloudinary
                let uploadedFile;
                try {
                    uploadedFile = yield cloudinary.uploader.upload(req.file.path, {
                        folder: "Ism App",
                        resource_type: "image",
                    });
                }
                catch (error) {
                    res.status(500);
                    throw new Error("Image could not be uploaded");
                }
                fileData = {
                    fileName: req.file.originalname,
                    filePath: uploadedFile.secure_url,
                    fileType: req.file.mimetype,
                    fileSize: (0, fileUpload_1.fileSizeFormatter)(req.file.size, 2),
                };
            }
            // Create product
            const product = yield Product_1.default.create({
                user: req.user.id,
                name,
                sku,
                category,
                quantity,
                price,
                description,
                image: fileData,
            });
            res.status(201).json(product);
        }));
        // Get all products
        this.getProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield Product_1.default.find({ user: req.user.id }).sort("-createdAt");
            res.status(200).json(products);
        }));
        // Get a single product
        this.getProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const product = yield Product_1.default.findById(req.params.id);
            // If product doesn't exist
            if (!product) {
                res.status(404);
                throw new Error("Product not found");
            }
            // Match the product to it's user
            if (((_a = product.user) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id) {
                res.status(401);
                throw new Error("User not authorized");
            }
            res.status(200).json(product);
        }));
        // Delete product
        this.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const product = yield Product_1.default.findById(req.params.id);
            // If product doesn't exist
            if (!product) {
                res.status(404);
                throw new Error("Product not found");
            }
            // Match the product to it's user
            if (((_b = product.user) === null || _b === void 0 ? void 0 : _b.toString()) !== req.user.id) {
                res.status(401);
                throw new Error("User not authorized");
            }
            yield product.remove();
            res.status(200).json({ message: "Product deleted." });
        }));
        // Update product
        this.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const { name, category, quantity, price, description } = req.body;
            const { id } = req.params;
            const product = yield Product_1.default.findById(id);
            // If product doesn't exist
            if (!product) {
                res.status(404);
                throw new Error("Product not found");
            }
            // Match the product to it's user
            if (((_c = product.user) === null || _c === void 0 ? void 0 : _c.toString()) !== req.user.id) {
                res.status(401);
                throw new Error("User not authorized");
            }
            // Handle Image upload
            let fileData = {};
            if (req.file) {
                // Save image to cloudinary
                let uploadedFile;
                try {
                    uploadedFile = yield cloudinary.uploader.upload(req.file.path, {
                        folder: "Ism App",
                        resource_type: "image",
                    });
                }
                catch (error) {
                    res.status(500);
                    throw new Error("Image could not be uploaded");
                }
                fileData = {
                    fileName: req.file.originalname,
                    filePath: uploadedFile.secure_url,
                    fileType: req.file.mimetype,
                    fileSize: (0, fileUpload_1.fileSizeFormatter)(req.file.size, 2),
                };
            }
            // Update product
            const updatedProduct = yield Product_1.default.findByIdAndUpdate({ _id: id }, {
                name,
                category,
                quantity,
                price,
                description,
                image: Object.keys(fileData).length === 0
                    ? product === null || product === void 0 ? void 0 : product.image
                    : fileData,
            }, {
                new: true,
                runValidators: true,
            });
            res.status(201).json(updatedProduct);
        }));
    }
}
exports.default = ProductController;

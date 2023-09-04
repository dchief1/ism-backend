import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../utils/extendRequest";
import { Response } from "express";
import Product from "../models/Product";
import { fileSizeFormatter } from "../utils/fileUpload";

// @ts-ignore
import * as cloudinary from "cloudinary/lib/v2";

export default class ProductController {
    // Create Product function
    createProduct = expressAsyncHandler(
        async (req: CustomRequest, res: Response) => {
            const { name, sku, category, quantity, price, description } =
                req.body;

            // Validation
            if (
                !name ||
                !sku ||
                !category ||
                !quantity ||
                !price ||
                !description
            ) {
                res.status(400);
                throw new Error("Please fill in all fields.");
            }

            // Handle Image upload
            let fileData = {};
            if (req.file) {
                // Save image to cloudinary
                let uploadedFile;
                try {
                    uploadedFile = await cloudinary.uploader.upload(
                        req.file.path,
                        {
                            folder: "Ism App",
                            resource_type: "image",
                        },
                    );
                } catch (error) {
                    res.status(500);
                    throw new Error("Image could not be uploaded");
                }

                fileData = {
                    fileName: req.file.originalname,
                    filePath: uploadedFile.secure_url,
                    fileType: req.file.mimetype,
                    fileSize: fileSizeFormatter(req.file.size, 2),
                };
            }

            // Create product
            const product = await Product.create({
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
        },
    );

    // Get all products
    getProducts = expressAsyncHandler(
        async (req: CustomRequest, res: Response) => {
            const products = await Product.find({ user: req.user.id }).sort(
                "-createdAt",
            );
            res.status(200).json(products);
        },
    );

    // Get a single product
    getProduct = expressAsyncHandler(
        async (req: CustomRequest, res: Response) => {
            const product = await Product.findById(req.params.id);
            // If product doesn't exist
            if (!product) {
                res.status(404);
                throw new Error("Product not found");
            }
            // Match the product to it's user
            if (product.user?.toString() !== req.user.id) {
                res.status(401);
                throw new Error("User not authorized");
            }
            res.status(200).json(product);
        },
    );

    // Delete product
    deleteProduct = expressAsyncHandler(
        async (req: CustomRequest, res: Response) => {
            const product = await Product.findById(req.params.id);
            // If product doesn't exist
            if (!product) {
                res.status(404);
                throw new Error("Product not found");
            }
            // Match the product to it's user
            if (product.user?.toString() !== req.user.id) {
                res.status(401);
                throw new Error("User not authorized");
            }
            await product.remove();
            res.status(200).json({ message: "Product deleted." });
        },
    );

    // Update product
    updateProduct = expressAsyncHandler(
        async (req: CustomRequest, res: Response) => {
            const { name, category, quantity, price, description } = req.body;
            const { id } = req.params;

            const product = await Product.findById(id);

            // If product doesn't exist
            if (!product) {
                res.status(404);
                throw new Error("Product not found");
            }
            // Match the product to it's user
            if (product.user?.toString() !== req.user.id) {
                res.status(401);
                throw new Error("User not authorized");
            }

            // Handle Image upload
            let fileData = {};
            if (req.file) {
                // Save image to cloudinary
                let uploadedFile;
                try {
                    uploadedFile = await cloudinary.uploader.upload(
                        req.file.path,
                        {
                            folder: "Ism App",
                            resource_type: "image",
                        },
                    );
                } catch (error) {
                    res.status(500);
                    throw new Error("Image could not be uploaded");
                }

                fileData = {
                    fileName: req.file.originalname,
                    filePath: uploadedFile.secure_url,
                    fileType: req.file.mimetype,
                    fileSize: fileSizeFormatter(req.file.size, 2),
                };
            }

            // Update product

            const updatedProduct = await Product.findByIdAndUpdate(
                { _id: id },
                {
                    name,
                    category,
                    quantity,
                    price,
                    description,
                    image:
                        Object.keys(fileData).length === 0
                            ? product?.image
                            : fileData,
                },
                {
                    new: true,
                    runValidators: true,
                },
            );

            res.status(201).json(updatedProduct);
        },
    );
}

import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../utils/extendRequest";
import { Response } from "express";
import Product from "../models/Product";
import { fileSizeFormatter } from "../utils/fileUpload";

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
                fileData = {
                    fileName: req.file.originalname,
                    filePath: req.file.path,
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
}

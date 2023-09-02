import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../utils/extendRequest";
import { Response } from "express";
import Product from "../models/Product";

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

            // Manage Image upload

            // Create product
            const product = await Product.create({
                user: req.user.id,
                name,
                sku,
                category,
                quantity,
                price,
                description,
            });

            res.status(201).json(product);
        },
    );
}

import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../utils/extendRequest";
import { Response } from "express";

export default class ProductController  {
    // Create Product
    createProduct = expressAsyncHandler (async (req: CustomRequest, res: Response) => {
        res.send("Product Created")
    });
}

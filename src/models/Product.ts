import { model, Schema, Document } from "mongoose";

const productSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
        },
        sku: { // unique number to identify the product
            type: String,
            required: true,
            default: "SKU",
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            trim: true,
        },
        quantity: {
            type: String,
            required: [true, "Please add a quantity"],
            trim: true,
        },
        price: {
            type: String,
            required: [true, "Please add a price"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            trim: true,
        },
        image: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    },
);

const Product = model("Product", productSchema);

export default Product;

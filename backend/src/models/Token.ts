import { model, Schema, Document } from "mongoose";

// export interface TokenDocument extends Document {}

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
})

const Token = model("Token", tokenSchema);

export default Token;
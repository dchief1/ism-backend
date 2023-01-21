import asyncHandler from "express-async-handler"; 
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import configs from "../config/config";
import { IGetUserAuthInfoRequest } from "../utils/extendRequest";

export interface JwtObject {
    id: string;
}

const protect = asyncHandler (async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["token"]
        console.log(token)
        if (!token) {
            res.status(401)
            throw new Error("Not authorized, please login");
        }

        // Verify Token
        const verified = jwt.verify(token, configs.JWT_SECRET)as JwtObject

       // Get user id from token
       const user = await User.findById(verified.id).select("-password")

       if (!user) {
        res.status(401)
        throw new Error("User was not found")
       }
       req.user = user
       next()

    } catch (error) {
        res.status(401)
        throw new Error("Not authorized, please login");
    }
});

export default protect;
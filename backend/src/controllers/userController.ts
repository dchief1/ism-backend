import { NextFunction, Request, Response } from "express";

const registerUser = (req: Request, res: Response) => {
    if(!req.body.email) {
        res.status(400)
        throw new Error("please add an email")
    }
    res.send("Register User")
};

export default (registerUser);
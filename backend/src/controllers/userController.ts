import { NextFunction, Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => {
    res.send("Register User")
};

export default (registerUser);
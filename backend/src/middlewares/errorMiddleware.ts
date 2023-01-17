import { NextFunction, Request, Response } from "express";
import configs from "../config/config";

const errorHandler = ( err: Error, req: Request, res: Response, next: NextFunction) => {

    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)

    res.json({
        message: err.message,
        stack: configs.ENVIRONMENT === "development" ? err.stack : null
    })
}

export default errorHandler;
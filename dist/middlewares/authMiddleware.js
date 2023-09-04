"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        // console.log(req.rawHeaders)
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, please login");
        }
        // Verify Token
        const verified = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        // Get user id from token
        const user = yield User_1.default.findById(verified.id).select("-password");
        if (!user) {
            res.status(401);
            throw new Error("User was not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401);
        throw new Error("Not authorized, please login");
    }
}));
exports.default = protect;

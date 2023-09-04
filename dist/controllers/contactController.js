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
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
class ContactController {
    constructor() {
        // contact us function
        this.contactUs = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { subject, message } = req.body;
            const user = yield User_1.default.findById(req.user._id);
            if (!user) {
                res.status(400);
                throw new Error("User not found, please signup");
            }
            //   Validation
            if (!subject || !message) {
                res.status(400);
                throw new Error("Please add subject and message");
            }
            const send_to = process.env.EMAIL_USER;
            const sent_from = process.env.EMAIL_USER;
            const reply_to = user.email;
            try {
                yield (0, sendEmail_1.default)(subject, message, send_to, sent_from, reply_to);
                res.status(200).json({ success: true, message: "Email Sent" });
            }
            catch (error) {
                res.status(500);
                throw new Error("Email not sent, please try again");
            }
        }));
    }
}
exports.default = ContactController;

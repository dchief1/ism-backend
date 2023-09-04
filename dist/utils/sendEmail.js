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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const sendEmail = (subject, message, send_to, sent_from, reply_to) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create email transporter
        const transporter = nodemailer_1.default.createTransport({
            host: config_1.default.EMAIL_HOST,
            port: 587,
            auth: {
                user: config_1.default.EMAIL_USER,
                pass: config_1.default.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        // Options for sending email
        const options = {
            from: sent_from,
            to: send_to,
            replyTo: reply_to,
            subject: subject,
            html: message,
        };
        // Send email
        const info = yield transporter.sendMail(options);
        console.log("Email sent:", info.response);
        // You can return a success message or status code here if needed.
        return "Email sent successfully";
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email not sent, please try again");
    }
});
exports.default = sendEmail;

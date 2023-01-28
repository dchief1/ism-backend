import nodemailer from "nodemailer"
import configs from "../config/config";
import { Request, Response } from "express";

export const sendEmail = async (subject: any, message: any, send_to: any, 
    sent_from: any, reply_to: any) => {
    // Create email transporter
    const transporter = nodemailer.createTransport({
        host: configs.EMAIL_HOST,
        port: 587,
        auth: {
            user: configs.EMAIL_USER,
            pass: configs.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    // Options for sending email
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    }

    // Send email
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        }
        console.log(info);
        
    })
};

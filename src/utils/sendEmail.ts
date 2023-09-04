import nodemailer from "nodemailer";
import configs from "../config/config";

const sendEmail = async (
    subject: any,
    message: any,
    send_to: any,
    sent_from: any,
    reply_to: any,
) => {
    try {
        // Create email transporter
        const transporter = nodemailer.createTransport({
            host: configs.EMAIL_HOST,
            port: 587,
            auth: {
                user: configs.EMAIL_USER,
                pass: configs.EMAIL_PASS,
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
        const info = await transporter.sendMail(options);
        console.log("Email sent:", info.response);

        // You can return a success message or status code here if needed.
        return "Email sent successfully";
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email not sent, please try again");
    }
};

export default sendEmail;

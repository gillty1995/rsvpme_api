"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendContactEmail = async (email, subject, message) => {
    try {
        console.log("📨 Preparing to send email...");
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            text: `From: ${email}\n\n${message}`,
        };
        console.log("Sending email with options:", mailOptions);
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
        return { success: true, message: "Email sent successfully" };
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
        return { success: false, message: "Failed to send email" };
    }
};
exports.sendContactEmail = sendContactEmail;

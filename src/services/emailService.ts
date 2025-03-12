import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendContactEmail = async (email: string, subject: string, message: string) => {
  try {
    console.log("📨 Preparing to send email...");

    const transporter = nodemailer.createTransport({
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
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};
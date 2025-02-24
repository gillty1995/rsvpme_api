import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  try {
    const mailOptions = {
      from: email, // The sender's email
      to: process.env.EMAIL_USER, // Your Gmail to receive the messages
      subject: `Contact Form: ${subject}`,
      text: `From: ${email}\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
};
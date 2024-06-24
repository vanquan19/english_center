const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendMailer = async (email, subject, text) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
        },
    });
    const message = {
        from: process.env.USERMAIL,
        to: email,
        subject: subject,
        text: text,
    };
    const result = await transporter.sendMail(message);
    return result;
};

module.exports = sendMailer;

// utils/email.js
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail', // O tu servicio
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};

module.exports = sendEmail;
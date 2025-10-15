// controllers/passwordController.js
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Restablecer Contraseña SIVSE',
        text: `Haz clic para restablecer: ${resetLink}`,
    });

    res.json({ message: 'Enlace enviado al email' });
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Contraseñas no coinciden' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Contraseña mínima 8 chars' });

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashed }, { where: { id: userId } });
        res.json({ message: 'Contraseña actualizada' });
    } catch (err) {
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
};
// src/controllers/authController.js - Lógica de auth
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (req, res) => {
    const { email, password, role } = req.body;

    // Validaciones
    if (!email || !password || password.length < 8) {
        return res
        .status(400)
        .json({ message: "Email requerido y password mínimo 8 caracteres" });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser)
        return res.status(400).json({ message: "Email ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10); // Salting automático
        const user = await User.create({ email, password: hashedPassword, role });

        res.status(201).json({ message: "Usuario registrado", userId: user.id });
    } catch (err) {
        res.status(500).json({ message: "Error en registro", err });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user)
        return res.status(401).json({ message: "Credenciales inválidas" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
        return res.status(401).json({ message: "Credenciales inválidas" });
        // Generar JWT
        const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );
        res.json({ token });

    } catch (err) {
        res.status(500).json({ message: "Error en login", err });
    }
};

module.exports = { register, login };

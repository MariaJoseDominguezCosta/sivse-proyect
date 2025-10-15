// src/controllers/authController.js - Lógica de auth
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (req, res) => {
    const schema = Joi.object({
    nombre_completo: Joi.string().required(),
    telefono: Joi.string().optional(),
    generacion: Joi.string().required(),
    carrera: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { nombre_completo, telefono, generacion, carrera, email, password } = req.body;

    try {
        if (await User.findOne({ where: { email } })) return res.status(400).json({ error: 'Email ya existe' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, role: 'egresado' });

        await Egresado.create({
        nombre_completo, telefono, generacion, carrera, email, user_id: user.id,
        });

        res.status(201).json({ message: 'Egresado registrado' });
    } catch (err) {
        res.status(500).json({ error: 'Error en registro' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role }); // Agrega role para redirigir en frontend
    } catch (err) {
        res.status(500).json({ error: 'Error en login' });
    }
};

module.exports = { register, login };

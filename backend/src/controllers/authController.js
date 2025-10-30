// src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario: User, Egresado: Egresado } = require("../models");

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
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error en registro', details: err.message });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está configurado en las variables de entorno');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Error en login', details: err.message });
    }
};

module.exports = { register, login };
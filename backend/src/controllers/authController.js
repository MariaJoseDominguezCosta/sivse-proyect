// src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario: User, Egresado: Egresado } = require("../models");
const Joi = require("joi");
const sequelize = require("../config/database");

const register = async (req, res) => {
  const schema = Joi.object({
    nombre_completo: Joi.string().required(),
    telefono: Joi.string().optional(),
    generacion: Joi.string().required(),
    carrera: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().valid(Joi.ref("password")).required(),
    sexo: Joi.string().valid('Masculino', 'Femenino', 'Otro').required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { nombre_completo, telefono, generacion, carrera, email, password, sexo } =
    req.body;

  // --- INICIO DE LA TRANSACCIÓN ---
  let transaction; 
  
  try {
    // 1. Obtener una nueva transacción
    transaction = await sequelize.transaction();

    // 2. Verificar duplicado de email (fuera de la transacción, pero esencial)
    if (await User.findOne({ where: { email } })) {
        await transaction.rollback(); // No es estrictamente necesario, pero buena práctica si ya se inició
        return res.status(400).json({ error: 'Email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Crear Usuario (pasando la transacción)
    const user = await User.create({ email, password: hashedPassword, role: 'egresado' }, { transaction });

    // 4. Crear Egresado (pasando la transacción)
    // NOTA: Si esta línea falla (ej. restricción de NOT NULL), se ejecutará el catch y el rollback.
    await Egresado.create({
      nombre_completo, 
      telefono, 
      generacion, 
      carrera, 
      email, 
      user_id: user.id,
      sexo
    }, { transaction });

    // 5. Commit si ambas operaciones fueron exitosas
    await transaction.commit();

    res.status(201).json({ message: 'Egresado registrado' });
    
  } catch (err) {
    // 6. Rollback si algo falló
    if (transaction) await transaction.rollback();
    
    console.error('Registration error:', err);
    // Verificar si el error fue por un campo unique (que se pudo haber saltado el chequeo inicial)
    const isUniqueError = err.name === 'SequelizeUniqueConstraintError'; 
    const errorMessage = isUniqueError ? 'El email o ID ya están en uso.' : err.message;

    res.status(500).json({ error: 'Error en registro', details: errorMessage });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET no está configurado en las variables de entorno"
      );
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Error en login", details: err.message });
  }
};

module.exports = { register, login };

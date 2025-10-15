// src/routes/authRoutes.js - Rutas auth
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Ejemplo de ruta protegida: app.use('/api/protected', authenticate, protectedRoute);

module.exports = router;
// src/routes/authRoutes.js - Rutas auth
const express = require('express');
const { register, login } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Ejemplo de ruta protegida: app.use('/api/protected', authenticate, protectedRoute);

module.exports = router;
// src/routes/authRoutes.js - Rutas auth
const express = require('express');
const { register, login } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');
const publicController = require('../controllers/publicController'); // NUEVO

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- Rutas Públicas Añadidas ---
router.get('/carreras', publicController.getCarreras); // NUEVO
router.get('/generaciones', publicController.getGeneraciones); // NUEVO
// ------------------------------
module.exports = router;
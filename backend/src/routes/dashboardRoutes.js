// src/routes/dashboardRoutes.js - Rutas protegidas por rol
const express = require('express');
const authenticate = require('../middlewares/authMiddleware').default;
const authorize = require('../middlewares/roleMiddleware').default;
const { adminDashboard, egresadoDashboard } = require('../controllers/dashboardController');

const router = express.Router();

// Ruta solo para admin
router.get('/admin/dashboard', authenticate, authorize(['admin']), adminDashboard);

// Ruta solo para egresado
router.get('/egresado/dashboard', authenticate, authorize(['egresado']), egresadoDashboard);

module.exports = router;
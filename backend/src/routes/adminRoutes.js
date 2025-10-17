// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware'); // Autenticación
const roleMiddleware = require('../middlewares/roleMiddleware'); // Autorización para admin
const { getStats } = require('../controllers/adminController');

// Rutas existentes o básicas
router.get('/stats', auth, roleMiddleware('admin'), getStats);

// Rutas para Seguimiento de Egresados (placeholders)
router.get('/egresados', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar getEgresados
    res.status(501).json({ error: 'No implementado' });
});
router.get('/egresados/:id', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar getEgresadoById
    res.status(501).json({ error: 'No implementado' });
});
router.put('/egresados/:id', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar updateEgresado
    res.status(501).json({ error: 'No implementado' });
});

// Rutas para Bolsa de Trabajo (placeholders)
router.get('/vacantes', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar getVacantes
    res.status(501).json({ error: 'No implementado' });
});
router.post('/vacantes', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar createVacante
    res.status(501).json({ error: 'No implementado' });
});
router.put('/vacantes/:id', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar updateVacante
    res.status(501).json({ error: 'No implementado' });
});
router.delete('/vacantes/:id', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar deleteVacante
    res.status(501).json({ error: 'No implementado' });
});

// Rutas para Gestión de Empresas (placeholders)
router.get('/empresas', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar getEmpresas
    res.status(501).json({ error: 'No implementado' });
});
router.post('/empresas', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar createEmpresa
    res.status(501).json({ error: 'No implementado' });
});
router.put('/empresas/:id', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar updateEmpresa
    res.status(501).json({ error: 'No implementado' });
});
router.delete('/empresas/:id', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar deleteEmpresa
    res.status(501).json({ error: 'No implementado' });
});

// Rutas para Reportes y Estadísticas (placeholders)
router.get('/reportes', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar getReportes
    res.status(501).json({ error: 'No implementado' });
});
router.get('/reportes/:type', auth, roleMiddleware('admin'), async (req, res) => {
  // Implementar getReporteByType
    res.status(501).json({ error: 'No implementado' });
});

module.exports = router;
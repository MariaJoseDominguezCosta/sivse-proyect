// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para el administrador
router.get('/stats', authMiddleware, adminController.getStats);
router.get('/egresados', authMiddleware, adminController.getEgresados);
router.get('/egresados/:id', authMiddleware, adminController.getEgresadoById);
router.get('/empresas', authMiddleware, adminController.getEmpresas);
router.get('/empresas/:id', authMiddleware, adminController.getEmpresaById);
router.post('/empresas', authMiddleware, adminController.createEmpresa);
router.put('/empresas/:id', authMiddleware, adminController.updateEmpresa); // Línea 15
router.delete('/empresas/:id', authMiddleware, adminController.deleteEmpresa);
router.get('/vacantes', authMiddleware, adminController.getVacantes);
router.post('/vacantes', authMiddleware, adminController.createVacante);
router.put('/vacantes/:id', authMiddleware, adminController.updateVacante);
router.delete('/vacantes/:id', authMiddleware, adminController.deleteVacante);
router.get('/vacantes/:id', authMiddleware, adminController.getVacanteById);

module.exports = router;
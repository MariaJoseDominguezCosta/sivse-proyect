// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger todas las rutas con autenticación y rol admin
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireRole('admin'));

// Gestión de empresas
router.get('/empresas', adminController.getEmpresas);
router.post('/empresas', adminController.createEmpresa);
router.get('/empresas/:id', adminController.getEmpresaById);
router.put('/empresas/:id', adminController.updateEmpresa);
router.delete('/empresas/:id', adminController.deleteEmpresa);

// Gestión de vacantes
router.get('/vacantes', adminController.getAllVacantes);
router.get('/vacantes/:id', adminController.getVacanteById);
router.put('/vacantes/:id', adminController.updateVacante);
router.delete('/vacantes/:id', adminController.deleteVacante);

// Gestión de vacantes por empresa
router.get('/empresas/:empresaId/vacantes', adminController.getVacantesByEmpresa);
router.post('/empresas/:empresaId/vacantes', adminController.createVacante);

// Gestión de egresados
router.get('/egresados', adminController.getEgresados);
router.get('/egresados/:id', adminController.getEgresadoById);
router.put('/egresados/:id', adminController.updateEgresado);
router.delete('/egresados/:id', adminController.deleteEgresado);

router.get('/dashboard', adminController.getDashboardSummary);

module.exports = router;
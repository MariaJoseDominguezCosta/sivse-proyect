const express = require('express');
const router = express.Router();
const empresasController = require('../controllers/empresasController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');  // Asume implementados

// GET todas (lectura para auth users)
router.get('/', authMiddleware, empresasController.getAllEmpresas);

// GET por ID (lectura para auth users)
router.get('/:id', authMiddleware, empresasController.getEmpresaById);

// POST crear (solo admin)
router.post('/', [authMiddleware, adminMiddleware], empresasController.createEmpresa);

// PUT editar (solo admin)
router.put('/:id', [authMiddleware, adminMiddleware], empresasController.updateEmpresa);

// DELETE eliminar (solo admin)
router.delete('/:id', [authMiddleware, adminMiddleware], empresasController.deleteEmpresa);

// GET vacantes por empresa (lectura para auth users)
router.get('/:id/vacantes', authMiddleware, empresasController.getVacantesByEmpresa);

module.exports = router;
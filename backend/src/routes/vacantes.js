// routes/vacantes.js
const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantesController');
const authMiddleware = require('../middlewares/authMiddleware'); // Verifica JWT
const roleMiddleware = require('../middlewares/roleMiddleware'); // Chequea rol, e.g., roleMiddleware('admin')

// GET /api/vacantes - Lista todas (protegida, todos los roles autenticados pueden leer)
router.get('/', authMiddleware, vacantesController.getAll);

// GET /api/vacantes/:id - Detalle (protegida, todos pueden leer)
router.get('/:id', authMiddleware, vacantesController.getById);

// POST /api/vacantes - Crear (solo admin)
router.post('/', authMiddleware, roleMiddleware('admin'), vacantesController.create);

// PUT /api/vacantes/:id - Editar (solo admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), vacantesController.update);

// DELETE /api/vacantes/:id - Eliminar (solo admin, con chequeo de integridad)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), vacantesController.deleteVacante);

module.exports = router;
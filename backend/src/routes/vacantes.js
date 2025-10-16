// routes/vacantes.js
const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantesController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, vacantesController.getAll);
router.get('/:id', authMiddleware, vacantesController.getById);
router.post('/', authMiddleware, roleMiddleware('admin'), vacantesController.create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), vacantesController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), vacantesController.deleteVacante);
router.post('/:id/toggle-favorite', authMiddleware, vacantesController.toggleFavorite); // Nuevo endpoint
router.post('/:id/aplicar', authMiddleware, roleMiddleware('egresado'), vacantesController.aplicar);

module.exports = router;
// backend/src/routes/egresadoRoutes.js
const express = require('express');
const router = express.Router();
const egresadoController = require('../controllers/egresadoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger todas las rutas con autenticación y rol egresado
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireRole('egresado'));

// Gestión de perfil
router.get('/profile', egresadoController.getProfile);
router.put('/profile', egresadoController.updateProfile);

// Gestión de favoritos
router.get('/favoritos', egresadoController.getFavoritos);
router.post('/favoritos', egresadoController.addFavorito);
router.delete('/favoritos/:id', egresadoController.removeFavorito);

// Recomendaciones de vacantes
router.get('/vacantes/recomendadas', egresadoController.getRecomendedVacantes);

// Gestión de vacantes
router.get('/vacantes', egresadoController.getVacantes);
router.get('/vacantes/:id', egresadoController.getVacanteById);

//Dashboard egresado
router.get('/dashboard', egresadoController.getDashboardSummary);


module.exports = router;
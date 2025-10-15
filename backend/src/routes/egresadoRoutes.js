const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, getRecommendedVacantes } = require('../controllers/egresadoController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/vacantes/recommended', auth, getRecommendedVacantes);

module.exports = router;
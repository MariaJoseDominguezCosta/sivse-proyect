// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const { getStats } = require('../controllers/adminController');

router.get('/stats', auth, authorize('admin'), getStats);

module.exports = router;
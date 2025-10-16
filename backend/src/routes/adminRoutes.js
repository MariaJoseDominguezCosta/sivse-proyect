// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { getStats } = require('../controllers/adminController');

router.get('/stats', auth, authorize('admin'), getStats);

module.exports = router;
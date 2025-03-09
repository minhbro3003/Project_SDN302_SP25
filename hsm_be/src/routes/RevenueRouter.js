const express = require('express');
const router = express.Router();
const RevenueController = require('../controllers/RevenueController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get revenue data based on employee ID and filters
router.get('/:employeeId', RevenueController.getRevenueData);

module.exports = router; 
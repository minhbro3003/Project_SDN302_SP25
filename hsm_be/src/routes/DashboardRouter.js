const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

// Get dashboard data based on employee ID
router.get('/:employeeId', DashboardController.getDashboardData);

module.exports = router; 
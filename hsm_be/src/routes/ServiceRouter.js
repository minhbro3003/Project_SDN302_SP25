const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/ServiceController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all services
router.get("/" /*,authMiddleware*/, ServiceController.getAllServices);

// Get a single service by ID
router.get("/:id"/*,authMiddleware*/, ServiceController.getServiceById);

// Create a new service
router.post("/"/*,authMiddleware*/, ServiceController.createService);

// Update a service by ID
router.put("/:id"/*,authMiddleware*/, ServiceController.updateService);

// Delete a service by ID
router.delete("/:id"/*,authMiddleware*/, ServiceController.deleteService);

module.exports = router;

const express = require("express");
const router = express.Router();
const AmenityController = require("../controllers/AmenityController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all amenities
router.get("/"/*,authMiddleware*/, AmenityController.getAllAmenities);

// Get a single amenities by ID
router.get("/:id"/*,authMiddleware*/, AmenityController.getAmenityById);

// Create a new amenities
router.post("/"/*,authMiddleware*/, AmenityController.createAmenity);

// Update a amenities by ID
router.put("/:id"/*,authMiddleware*/, AmenityController.updateAmenity);

// Delete a amenities by ID
router.delete("/:id"/*,authMiddleware*/, AmenityController.deleteAmenity);

module.exports = router;

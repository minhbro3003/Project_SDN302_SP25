const express = require("express");
const router = express.Router();
const RoomAmenityController = require("../controllers/RoomAmenityController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all room amenities
router.get("/", RoomAmenityController.getAllRoomAmenities);

// Get not functioning room amenities
router.get("/not-functioning", RoomAmenityController.getNotFunctioningRoomAmenities);

// Get a single room amenity by ID
router.get("/:id", RoomAmenityController.getRoomAmenityById);

// Create a new room amenity
router.post("/", RoomAmenityController.createRoomAmenity);

// Update a room amenity by ID
router.put("/:id", RoomAmenityController.updateRoomAmenity);

// Delete a room amenity by ID
router.delete("/:id", RoomAmenityController.deleteRoomAmenity);

// Get amenities for a specific room
router.get("/:roomId/amenities", RoomAmenityController.getAmenitiesByRoomIdController);

// Update amenities for a specific room
router.put("/:roomId/amenities", RoomAmenityController.updateRoomAmenitiesByRoomIdController);

module.exports = router;

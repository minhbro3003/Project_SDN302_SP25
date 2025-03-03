const express = require("express");
const router = express.Router();
const RoomAmenityController = require("../controllers/RoomAmenityController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all bookings
router.get("/"/*,authMiddleware*/, RoomAmenityController.getAllRoomAmenities);

router.get("/not-functioning"/*,authMiddleware*/, RoomAmenityController.getNotFunctioningRoomAmenities);
// Get a single booking by ID
router.get("/:id"/*,authMiddleware*/, RoomAmenityController.getRoomAmenityById);

// Create a new booking
router.post("/"/*,authMiddleware*/, RoomAmenityController.createRoomAmenity);

// Update a booking by ID
router.put("/:id"/*,authMiddleware*/, RoomAmenityController.updateRoomAmenity);

// Delete a booking by ID
router.delete("/:id"/*,authMiddleware*/, RoomAmenityController.deleteRoomAmenity);

router.post("/:id", RoomAmenityController.getRoomAmenitiesByRoomId);

router.post("/:id", RoomAmenityController.updateRoomAmenities);


module.exports = router;

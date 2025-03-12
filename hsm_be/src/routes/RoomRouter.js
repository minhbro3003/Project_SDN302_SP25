const express = require("express");
const router = express.Router();
// const productController = require("../controllers/ProductController");
const roomsController = require("../controllers/RoomController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

// Get all rooms
router.get("/", roomsController.getAllRooms);

// Check room availability - specific route should come before parameter routes
router.get("/availability", roomsController.checkRoomAvailability);

// Get available rooms
router.get("/getavail", roomsController.getAvailableRooms);

// Get available rooms (alternative)
router.get("/getavail_", roomsController.getAvailableRooms_);

// Get rooms by hotel
router.get("/hotel/:hotelId", roomsController.getRoomsByHotel);

// Create new room
router.post("/", roomsController.createRooms);

// Update room
router.put("/:id", roomsController.updateRoom);

// Delete room
router.delete("/:id", roomsController.deleteRoom);

// Get room by id - this should come last as it's a catch-all for /rooms/:id
router.get("/:id", roomsController.getRoomByRoomId);

module.exports = router;

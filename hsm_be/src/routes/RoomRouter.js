const express = require("express");
const router = express.Router();
// const productController = require("../controllers/ProductController");
const roomsController = require("../controllers/RoomController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

//router get all rooms
router.get("/", roomsController.getAllRooms);
//router get available rooms
router.get("/getavail", roomsController.getAvailableRooms);

router.get("/getavail_", roomsController.getAvailableRooms_);

//router create new room
router.post("/", roomsController.createRooms);
//router update by id
router.put("/:id", roomsController.updateRoom);
//delete room
router.delete("/:id", roomsController.deleteRoom);
//router get room by id
router.get("/:id", roomsController.getRoomByRoomId);

// Get rooms by hotel
router.get("/hotel/:hotelId", roomsController.getRoomsByHotel);

module.exports = router;

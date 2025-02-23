const express = require("express");
const router = express.Router();
// const productController = require("../controllers/ProductController");
const roomsController = require("../controllers/RoomController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

//router get rooms by type
router.get("/by-type", roomsController.getRoomsGroupedByTypeController);

//router get all rooms
router.get("/", roomsController.getAllRooms);

//router get available rooms
router.get("/getavail", roomsController.getAvailableRooms);

//router create new room
router.post("/", roomsController.createRooms);
//router update by id
router.put("/:id", roomsController.updateRoom);
//delete room
router.delete("/:id", roomsController.deleteRoom);
//router get room by id
router.get("/:id", roomsController.getRoomByRoomId);

module.exports = router;

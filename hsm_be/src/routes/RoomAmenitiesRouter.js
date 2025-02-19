const express = require("express");
const router = express.Router();
// const productController = require("../controllers/ProductController");
const roomsAmenitiesController = require("../controllers/RoomsAmenitiesController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

//router get all rooms
router.get("", roomsAmenitiesController.getAllRoomsAmenities);
//router create new room
// router.post("", roomsTypeController.createRooms);
// //router update by id
// router.put("/:id", roomsTypeController.updateRoom);
// //delete room
// router.delete("/:id", roomsTypeController.deleteRoom);
// //router get room by id
// router.get("/:id", roomsTypeController.getRoomByRoomId);

module.exports = router;
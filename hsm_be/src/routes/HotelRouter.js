const express = require("express");
const router = express.Router();
const HotelController = require("../controllers/HotelController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.get("/get-all-hotel", HotelController.getAllHotel);
router.get("/by-room/:id", HotelController.getHotelByRoomId);
module.exports = router;
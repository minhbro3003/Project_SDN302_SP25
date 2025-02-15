const express = require("express");
const router = express.Router();
const HotelController = require("../controllers/HotelController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");
//router get all hotel
router.get("", HotelController.getAllHotel);
//router create new hotel
router.post("", HotelController.createHotel);
//router get hotel by id
router.get("/:id", HotelController.getHotelById);
//router update hotel
router.put("/:id", HotelController.updateHotel);
//delete hotel
router.delete("/:id", HotelController.deleteHotel);

module.exports = router;
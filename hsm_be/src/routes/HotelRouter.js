const express = require("express");
const router = express.Router();
const HotelController = require("../controllers/HotelController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.get("/get-all-hotel", HotelController.getAllHotel);

module.exports = router;
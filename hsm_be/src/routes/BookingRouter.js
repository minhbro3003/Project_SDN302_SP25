const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/BookingController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");
router.get("/hotel/:hotelId", bookingController.getBookingsByHotel);
router.post("/create-booking", bookingController.createBooking);
router.get("/get-all-booking", bookingController.getAllBooking);


module.exports = router;
const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingControllerRFA");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all bookings
router.get("/"/*,authMiddleware*/, BookingController.getAllBookings);

// Get a single booking by ID
router.get("/:id"/*,authMiddleware*/, BookingController.getBookingById);

// Create a new booking
router.post("/"/*,authMiddleware*/, BookingController.createBooking);

// Update a booking by ID
router.put("/:id"/*,authMiddleware*/, BookingController.updateBooking);

// Delete a booking by ID
router.delete("/:id"/*,authMiddleware*/, BookingController.deleteBooking);

module.exports = router;

const BookingService = require("../services/BookingService");

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await BookingService.getAllBookings();
        return res.status(200).json(bookings);
    } catch (e) {
        return res.status(500).json({
            message: "Failed to retrieve bookings",
            error: e.message,
        });
    }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json(booking);
    } catch (e) {
        return res.status(500).json({
            message: "Error retrieving booking",
            error: e.message,
        });
    }
};

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const booking = await BookingService.createBooking(req.body);
        return res.status(201).json(booking);
    } catch (e) {
        return res.status(400).json({
            message: "Booking creation failed",
            error: e.message,
        });
    }
};



// Update a booking by ID
const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await BookingService.updateBooking(req.params.id, req.body);
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json(updatedBooking);
    } catch (e) {
        return res.status(400).json({
            message: "Booking update failed",
            error: e.message,
        });
    }
};

// Delete a booking by ID
const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await BookingService.deleteBooking(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ message: "Booking deleted successfully" });
    } catch (e) {
        return res.status(500).json({
            message: "Booking deletion failed",
            error: e.message,
        });
    }
};



module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
};

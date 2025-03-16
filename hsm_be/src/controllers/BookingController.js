const BookingService = require("../services/BookingService");

const createBooking = async (req, res) => {
    try {
        const {
            customers,
            rooms,
            Time,
            GuestsNumber,
            SumPrice,
            Status,
        } = req.body;
        
        const booking = await BookingService.createBooking(req.body);
        return res.status(200).json(booking);
    } catch (e) {
        return res.status(404).json({
            message: "Booking creation failed",
            error: e.message,
        });
    }
};

const getAllBooking = async (req, res) => {
    try {
        const booking = await BookingService.getAllBooking();
        return res.status(200).json(booking);
    } catch (e) {
        return res.status(404).json({
            message: "Booking not found",
            error: e.message,
        });
    }
};
const getBookingsByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;

        if (!hotelId) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        const bookings = await BookingService.getAllBookingsByHotelId(hotelId);
        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createBooking,
    getAllBooking,
    getBookingsByHotel
};
const Booking= require("../models/BookingModel");
const Room= require("../models/RoomModel");

const createBooking = (newBooking) => {
    return new Promise(async (resolve, reject) => {
        const { customers, rooms, Time, GuestsNumber, SumPrice, Status } = newBooking;
        try {
            

            const newBooking = await Booking.create({
                customers,
                rooms,
                Time,
                GuestsNumber,
                SumPrice,
                Status,
            });

            resolve({
                status: "OK",
                message: "Success",
                data: newBooking,
            });
        } catch (e) {
            reject({
                status: "error",
                message: e.message || "Internal server error",
                code: 500
            });
        }
    });
};

const getAllBooking = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBooking = await Booking.find();
            resolve({
                status: "OK",
                message: " All Booking successfully",
                data: allBooking,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllBookingsByHotelId = async (hotelId) => {
    console.log("🔍 Tìm phòng thuộc khách sạn:", hotelId);
    const rooms = await Room.find({ hotel: hotelId }).select("_id");
    console.log("✅ Danh sách phòng:", rooms);

    const roomIds = rooms.map(room => room._id);
    console.log("✅ Danh sách roomIds:", roomIds);

    const bookings = await Booking.find({ rooms: { $in: roomIds } })
        .populate({
            path: "rooms",
            select: "-Image"
        });

    console.log("✅ Danh sách booking tìm thấy:", bookings);
    return bookings;
};

module.exports = {
    createBooking,
    getAllBooking,
    getAllBookingsByHotelId
};
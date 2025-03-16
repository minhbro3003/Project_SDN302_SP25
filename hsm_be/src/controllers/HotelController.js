const HotelService = require("../services/HotelService");

//get all hotel 
const getAllHotel = async (req, res) => {
    try {
        const hotel = await HotelService.getAllHotel();
        return res.status(200).json(hotel);
    } catch (e) {
        return res.status(404).json({
            message: "Hotel not found",
            error: e.message,
        });
    }
};
// Lấy khách sạn theo roomId
const getHotelByRoomId = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await HotelService.getHotelByRoomId(id);

        if (hotel.status === "NOT_FOUND") {
            return res.status(404).json(hotel);
        }

        return res.status(200).json(hotel);
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message,
        });
    }
};


module.exports = {
    getAllHotel,
    getHotelByRoomId
};
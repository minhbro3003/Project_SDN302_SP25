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

module.exports = {
    getAllHotel,
};
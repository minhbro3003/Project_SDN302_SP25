const RoomsAmenitiesService = require("../services/RoomAmenitiesService");

//get all rooms
const getAllRoomsAmenities = async (req, res) => {
    try {
        const roomAmenities = await RoomsAmenitiesService.getAllRoomsAmenitiesService();
        return res.status(200).json(roomAmenities);
    } catch (e) {
        return res.status(404).json({
            error: e.message,
        });
    }
};

module.exports = {
    getAllRoomsAmenities,
}
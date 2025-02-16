const RoomsAmenities = require("../models/RoomAmenitiesModel");

//get all rooms type
const getAllRoomsAmenitiesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRoomsAmenities = await RoomsAmenities.find();
            resolve({
                status: "OK",
                message: " All rooms successfully",
                data: allRoomsAmenities,
            });
        } catch (e) {
            console.log("Error: ", e.message);
            reject(e);
        }
    });
};

module.exports = { getAllRoomsAmenitiesService, }

const Hotel = require("../models/HotelModel");

const getAllHotel = async () => {

    try {
        const allHotel = await Hotel.find();
        resolve({
            status: "OK",
            message: " All Hotel successfully",
            data: allHotel,
        });
    } catch (e) {
        reject(e);
    }
};

module.exports = {
    getAllHotel,

};
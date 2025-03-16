
const Hotel = require("../models/HotelModel");
const Room = require("../models/RoomModel")

const getAllHotel = () => {
    return new Promise(async (resolve, reject) => {
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
    });
};

const getHotelByRoomId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Tìm room theo roomId
            const room = await Room.findById(id);
            
            if (!room) {
                return resolve({
                    status: "NOT_FOUND",
                    message: "Không tìm thấy phòng với roomId này",
                });
            }

            // 2. Tìm hotel theo hotelId từ room
            const hotel = await Hotel.findById(room.hotel);

            if (!hotel) {
                return resolve({
                    status: "NOT_FOUND",
                    message: "Không tìm thấy khách sạn của phòng này",
                });
            }

            resolve({
                status: "OK",
                message: "Tìm thấy khách sạn thành công",
                data: hotel,
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: e.message,
            });
        }
    });
};

module.exports = {
    getAllHotel,
    getHotelByRoomId
};
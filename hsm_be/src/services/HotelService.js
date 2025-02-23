const mongoose = require("mongoose"); // 👈 Import mongoose để tránh lỗi
const Hotel = require("../models/HotelModel");


//get all hotel
const getAllHotel = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allHotel = await Hotel.find()
                .populate("rooms");
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


//get hotel by id
const getHotelByIdService = async (id) => {
    try {
        const hotel = await Hotel.findById(id)
            .populate("rooms"); // Lấy chi tiết phòng

        if (!hotel) {
            return {
                status: "ERR",
                message: "Hotel not found"
            };
        }
        return {
            status: "OK",
            message: "Hotel successfully",
            data: hotel
        };
    } catch (e) {
        console.error("Error in getHotelByIdService:", e.message);
        return {
            status: "ERR",
            message: "Internal Server Error",
            error: e.message
        };
    }
};

//create a totel 
const createHotelService = async (newHotel) => {
    try {
        const {
            CodeHotel, NameHotel, Introduce, Title, LocationHotel,
            Note, image, rooms, Active, IsDelete
        } = newHotel;

        console.log("📌 Data nhận từ FE:", newHotel);

        // Kiểm tra dữ liệu rooms
        if (!Array.isArray(rooms) || rooms.length === 0) {
            return { status: "ERR", message: "Danh sách rooms không hợp lệ" };
        }

        if (rooms.some(room => !mongoose.Types.ObjectId.isValid(room))) {
            return { status: "ERR", message: "Dữ liệu rooms chứa ObjectId không hợp lệ" };
        }

        const checkHotel = await Hotel.findOne({
            $or: [{ CodeHotel }, { NameHotel }]
        });

        if (checkHotel) {
            return { status: "ERR", message: "The hotel code or name already exists" };
        }

        // Lưu danh sách `_id` của `Rooms`
        const newHotelData = new Hotel({
            CodeHotel, NameHotel, Introduce, Title, LocationHotel,
            Note, image, rooms, Active, IsDelete
        });

        const savedHotel = await newHotelData.save();
        return { status: "OK", message: "Create hotel successfully", data: savedHotel };
    } catch (error) {
        console.error("❌ Error in createHotelService:", error.message);
        return { status: "ERR", message: "Create hotel failed", error: error.message };
    }
};


//update a hotel
const updateHotelService = async (id, data) => {
    try {
        const checkHotel = await Hotel.findById(id);
        if (!checkHotel) {
            return {
                status: "ERR",
                message: "Hotel not found",
            };
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(id, data, { new: true });

        return {
            status: "OK",
            message: "Hotel successfully updated",
            data: updatedHotel,
        };
    } catch (error) {
        console.error("Error in updateHotelService:", error.message);
        return {
            status: "ERR",
            message: "Update hotel failed",
            error: error.message,
        };
    }
};

//delete a hotel
const deleteHotelService = async (id) => {
    try {
        const checkHotel = await Hotel.findById(id);
        if (!checkHotel) {
            return {
                status: "ERR",
                message: "Hotel not found",
            };
        }

        await Hotel.findByIdAndDelete(id);

        return {
            status: "OK",
            message: "Hotel successfully deleted",
        };
    } catch (error) {
        console.error("Error in deleteHotelService:", error.message);
        return {
            status: "ERR",
            message: "Delete hotel failed",
            error: error.message,
        };
    }
};

module.exports = {
    getAllHotel,
    createHotelService,
    getHotelByIdService,
    updateHotelService,
    deleteHotelService
};
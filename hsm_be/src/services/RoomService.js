const Employee = require("../models/EmployeeModel");
const Rooms = require("../models/RoomModel");
const RoomType = require("../models/RoomTypeModel");
//get all rooms

const getAllRoomsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRooms = await Rooms.find({}, "-createdAt -updatedAt")//"-Image"
                .populate("roomtype", "-Note")
                .populate("hotel", "CodeHotel NameHotel ")
            resolve({
                status: "OK",
                message: "All rooms successfully",
                data: allRooms,
            });
        } catch (e) {
            console.log("Error: ", e.message);
            reject(e);
        }
    });
};

//get room by id
const getRoomByRoomIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const room = await Rooms.findById(id); // ,"-Image"
            if (!room) {
                resolve({
                    status: "ERR",
                    message: "The Room is not defined",
                });
            }
            resolve({
                status: "OK",
                message: "Room successfully",
                data: room,
            });
        } catch (e) {
            console.log("Error: ", e.message);
            reject(e);
        }
    });
};

//creat a room
const createRoomService = async (newRoom) => {
    try {
        const {
            RoomName, Price, Status, Floor, Active, hotel,
            roomtype, Description, Image, IsDelete,
        } = newRoom;

        const checkRoomName = await Rooms.findOne({
            RoomName: { $regex: `^${RoomName.trim()}$`, $options: "i" },
        });
        if (checkRoomName) {
            return {
                status: "ERR",
                message: "The room name already exists",
            };
        }
        //create room
        const newedRoomData = new Rooms({
            RoomName, Price, Status, Floor, Active, hotel,
            roomtype, Description, Image, IsDelete,
        });
        //save database
        const savedRoom = await newedRoomData.save();

        return {
            status: "OK",
            message: "Create room successfully",
            data: savedRoom,
        };
    } catch (error) {
        console.error("Error in createRoomService:", error.message);
        return {
            status: "ERR",
            message: "Create room failed",
            error: error.message,
        };
    }
};

//update room by id
const updateRoomService = async (id, data) => {
    try {
        const checkRoom = await Rooms.findById(id);
        console.log("checkRoom: ", checkRoom);
        if (!checkRoom) {
            return {
                status: "ERR",
                message: "The room is not defined",
            };
        }
        const updatedRoom = await Rooms.findByIdAndUpdate(id, data, {
            new: true,
        });
        return {
            status: "OK",
            message: "Update room successfully",
            data: updatedRoom,
        };
    } catch (error) {
        console.log("Error in UpdateRoom", error.message);
        return {
            status: "ERR",
            message: "Update room failed",
            error: error.message,
        };
    }
};

// delete room
const deleteRoomService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRoom = await Rooms.findOne({ _id: id }); //_id
            console.log("checkRoom: ", checkRoom);
            if (!checkRoom) {
                resolve({
                    status: "ERR",
                    message: "The Room is not defined",
                });
            }

            await Rooms.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete room successfully",
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAvailableRooms = async () => {
    try {
        const availableRooms = await Rooms.find({
            Status: "Available",
            IsDelete: false
        }).select("RoomName Price roomtype Description Status");

        return {
            status: "OK",
            message: "Available rooms retrieved successfully",
            data: availableRooms,
        };
    } catch (error) {
        console.error("Error in getAvailableRooms:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve available rooms",
            error: error.message,
        };
    }
};


const getAvailableRooms_ = async (startDate, endDate) => {
    try {
        // Find rooms that have conflicting bookings
        const bookedRooms = await Booking.find({
            $or: [
                { "Time.Checkin": { $lt: endDate }, "Time.Checkout": { $gt: startDate } }
            ]
        }).distinct("rooms"); // Get distinct booked room IDs

        // Get all rooms that are NOT in the bookedRooms list
        const availableRooms = await Room.find({
            _id: { $nin: bookedRooms },
            IsDelete: false
        });

        return {
            status: "OK",
            message: "Available rooms retrieved successfully",
            data: availableRooms,
        };
    } catch (error) {
        console.error("Error in getAvailableRooms:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve available rooms",
            error: error.message,
        };
    }
};

const getRoomsByHotelService = async (hotelId) => {
    try {
        const rooms = await Rooms.find({
            hotel: hotelId,
            IsDelete: false
        })
            .populate("roomtype")
            .populate("hotel", "CodeHotel NameHotel");

        return {
            status: "OK",
            message: "Rooms retrieved successfully",
            data: rooms
        };
    } catch (error) {
        console.error("Error in getRoomsByHotelService:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve rooms",
            error: error.message
        };
    }
};

const getRoomsByAccount = async (accountId) => {
    try {
        // console.time("fetchData");


        const employee = await Employee.findOne({ accountId });
        if (!employee) {
            return { success: false, message: "Không tìm thấy nhân viên với tài khoản này" };
        }


        const hotelIds = employee.hotels.map(hotel => hotel._id);


        // Sử dụng aggregation pipeline thay vì populate
        const hotelsWithRooms = await Rooms.aggregate([
            { $match: { hotel: { $in: hotelIds }, IsDelete: false } },
            {
                $lookup: {
                    from: "hotels", // Tên collection
                    localField: "hotel",
                    foreignField: "_id",
                    as: "hotelData",
                },
            },
            { $unwind: "$hotelData" },
            {
                $group: {
                    _id: "$hotel",
                    NameHotel: { $first: "$hotelData.NameHotel" },
                    LocationHotel: { $first: "$hotelData.LocationHotel" },
                    rooms: {
                        $push: {
                            id: "$_id",
                            name: "$RoomName",
                            status: "$Status",
                            floor: "$Floor",
                            price: "$Price",
                            description: "$Description",
                            roomType: "$roomtype.TypeName"
                        }
                    }
                }
            }
        ]);


        // console.timeEnd("fetchData");
        return { success: true, data: hotelsWithRooms };


    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getAllRoomsService,
    createRoomService,
    updateRoomService,
    deleteRoomService,
    getRoomByRoomIdService,
    getAvailableRooms_,
    getAvailableRooms,
    getRoomsByHotelService,
    getRoomsByAccount,
};

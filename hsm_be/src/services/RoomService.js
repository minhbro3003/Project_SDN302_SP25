const Rooms = require("../models/RoomModel");
const RoomType = require("../models/RoomTypeModel");
//get all rooms

const getRoomsGroupedByType = async () => {
    try {
        const roomsRaw = await Rooms.find({ IsDelete: false }).lean();
        // console.log("Raw rooms data:", roomsRaw); // Kiểm tra dữ liệu phòng

        const groupedRooms = await Rooms.aggregate([
            {
                $match: { IsDelete: false }
            },
            {
                $group: {
                    _id: "$roomtype",
                    count: { $sum: 1 },
                    rooms: { $push: { _id: "$_id" } }
                }
            },
            {
                $lookup: {
                    from: "roomtypes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "roomtypeDetails"
                }
            },
            {
                $unwind: "$roomtypeDetails"
            },
            {
                $project: {
                    _id: 0,
                    roomtypeId: "$_id",
                    roomtypeName: "$roomtypeDetails.TypeName",
                    count: 1,
                    rooms: 1
                }
            }
        ]);

        // console.log("Aggregated rooms:", groupedRooms); // Kiểm tra kết quả

        return {
            status: "OK",
            message: "Successfully fetched rooms grouped by type",
            data: groupedRooms,
        }
    } catch (error) {
        console.error("Error fetching rooms grouped by type:", error);
        throw error;
    }
};

const getAllRoomsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRooms = await Rooms.find().populate("roomtype");
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
            const room = await Rooms.findById(id);
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
            RoomName, Price, Status, Floor, Active,
            roomtype, Description, Image, IsDelete,
        } = newRoom;

        const checkRoomName = await Rooms.findOne({
            RoomName: { $regex: `^${RoomName.trim()}$`, $options: "i" },
            Floor: Floor // Chỉ kiểm tra trong cùng 1 tầng
        });
        if (checkRoomName) {
            return {
                status: "ERR",
                message: "A room with this name already exists on this floor",
            };
        }
        //create room
        const newedRoomData = new Rooms({
            RoomName, Price, Status, Floor, Active,
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
module.exports = {
    getAllRoomsService,
    createRoomService,
    updateRoomService,
    deleteRoomService,
    getRoomByRoomIdService,
    getAvailableRooms,
    getRoomsGroupedByType
};

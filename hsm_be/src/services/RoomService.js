const Rooms = require("../models/RoomModel");
const RoomType = require("../models/RoomTypeModel");
//get all rooms

const getAllRoomsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRooms = await Rooms.find({},)//"-Image"
                .populate("roomtype")
                .populate("hotel", "CodeHotel NameHotel Introduce LocationHotel ")
            // Format lại dữ liệu
            const formatData = allRooms.map((room) => {
                // console.log("room_amenities:", room.room_amenities); 

                return {
                    id: room._id,
                    RoomName: room.RoomName,
                    Price: room.Price,
                    Status: room.Status,
                    Floor: room.Floor,
                    Active: room.Active,
                    IsDelete: room.IsDelete,
                    Description: room.Description,
                    typerooms: room.typerooms
                        ? { TypeName: room.typerooms.TypeName, Note: room.typerooms.Note }
                        : null,
                    room_amenities: Array.isArray(room.room_amenities)
                        ? room.room_amenities.map((amenity) => ({
                            id: amenity.room_amenitiesID?._id,
                            name: amenity.room_amenitiesID?.AmenitiesName,
                            note: amenity.room_amenitiesID?.Note,
                            quantity: amenity.quantity,
                            status: amenity.status,
                        }))
                        : [], // Nếu room_amenities không phải mảng, trả về mảng rỗng
                    Image: Array.isArray(room.Image)
                        ? room.Image.map((img) => ({
                            url: img.url,
                            alt: img.alt || "Room Image",
                        }))
                        : [], // Kiểm tra Image có phải mảng không
                };
            });
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
module.exports = {
    getAllRoomsService,
    createRoomService,
    updateRoomService,
    deleteRoomService,
    getRoomByRoomIdService,
    getAvailableRooms,
};

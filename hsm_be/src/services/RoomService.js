const Rooms = require("../models/RoomModel");
const Employee = require("../models/EmployeeModel");
const mongoose = require("mongoose");
const Hotel = require("../models/HotelModel");
// const getAllRoomsService = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const allRooms = await Rooms.find();
//             resolve({
//                 status: "OK",
//                 message: " All rooms successfully",
//                 data: allRooms,
//             });
//         } catch (e) {
//             console.log("Error: ", e.message);
//             reject(e);
//         }
//     });
// };
const getAllRoomsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRooms = await Rooms.find()
                .populate({ path: "typerooms" })
                .populate({ path: "room_amenities.room_amenitiesID" })
                .lean(); // Chuyển về object thuần JS để dễ xử lý

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
                data: formatData,
            });
        } catch (e) {
            console.log("Error: ", e.message);
            reject(e);
        }
    });
};









const getRoomsByAccount = async (accountId) => {
    try {
        // Tìm nhân viên theo accountId
        const employee = await Employee.findOne({ accountId }).populate("hotels");
        if (!employee) {
            return { success: false, message: "Không tìm thấy nhân viên với tài khoản này" };
        }

        // Lấy danh sách ID của các khách sạn mà nhân viên làm việc
        const hotelIds = employee.hotels.map(hotel => hotel._id);

        // Lấy danh sách phòng thuộc những khách sạn đó
        const rooms = await Rooms.find({ hotel: { $in: hotelIds }, IsDelete: false })
            .populate("hotel", "NameHotel LocationHotel")
            

        // Nhóm phòng theo khách sạn
        const hotelsWithRooms = hotelIds.map(hotelId => {
            const hotelRooms = rooms.filter(room => room.hotel._id.toString() === hotelId.toString());
            return {
                hotelId,
                NameHotel: hotelRooms.length > 0 ? hotelRooms[0].hotel.NameHotel : "Unknown",
                LocationHotel: hotelRooms.length > 0 ? hotelRooms[0].hotel.LocationHotel : "Unknown",
                rooms: hotelRooms.map(room => ({
                    id: room._id,
                    name: room.RoomName,
                    status: room.Status,
                    floor: room.Floor,
                    price: room.Price,
                    description: room.Description,
                    image: room.Image,
                    roomType: room.roomtype ? room.roomtype.TypeName : "Unknown",
                }))
            };
        });

        return { success: true, data: hotelsWithRooms };
    } catch (error) {
        return { success: false, message: error.message };
    }
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
            typerooms, room_amenities, Description, Image, IsDelete,
        } = newRoom;

        const checkRoomName = await Rooms.findOne({
            RoomName,
        });
        if (checkRoomName) {
            return {
                status: "ERR",
                message: "The name of product is already",
            };
        }

        //create room
        const newedRoomData = new Rooms({
            RoomName, Price, Status, Floor, Active,
            typerooms, room_amenities, Description, Image, IsDelete,
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

module.exports = {
    getAllRoomsService,
    createRoomService,
    updateRoomService,
    deleteRoomService,
    getRoomByRoomIdService,
    getRoomsByAccount,
    // createProduct,
    // updateProduct,
    // getDetailsProduct,
    // deleteProduct,
    // getAllProduct,
    // deleteManyProduct,
    // getAllTypes,
};

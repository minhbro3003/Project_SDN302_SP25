// const Product = require("../models/ProductModel");
const Room = require("../models/RoomModel");
const Rooms = require("../models/RoomModel");

//get all rooms
const getAllRoomsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRooms = await Rooms.find();
            resolve({
                status: "OK",
                message: " All rooms successfully",
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
            RoomName,
            Price,
            Status,
            Floor,
            Active,
            typerooms,
            room_amenities,
            Description,
            Image,
            IsDelete,
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
            RoomName,
            Price,
            Status,
            Floor,
            Active,
            typerooms,
            room_amenities,
            Description,
            Image,
            IsDelete,
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
        const checkRoom = await Room.findById(id);
        console.log("checkRoom: ", checkRoom);
        if (!checkRoom) {
            return {
                status: "ERR",
                message: "The room is not defined",
            };
        }
        const updatedRoom = await Room.findByIdAndUpdate(id, data, {
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
            const checkRoom = await Room.findOne({ _id: id }); //_id
            console.log("checkRoom: ", checkRoom);
            if (!checkRoom) {
                resolve({
                    status: "ERR",
                    message: "The Room is not defined",
                });
            }

            await Room.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete room successfully",
            });
        } catch (e) {
            reject(e);
        }
    });
};

// const updateProduct = (id, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const checkProduct = await Product.findOne({ _id: id }); //_id
//             console.log("checkProduct: ", checkProduct);
//             if (checkProduct === null) {
//                 resolve({
//                     status: "OK",
//                     message: "The product is not defined",
//                 });
//             }

//             const updatedProduct = await Product.findByIdAndUpdate(id, data, {
//                 new: true,
//             });
//             resolve({
//                 status: "OK",
//                 message: "Updata Product Success",
//                 data: updatedProduct,
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// const deleteProduct = (id) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const checkProduct = await Product.findOne({ _id: id }); //_id
//             console.log("checkUser: ", checkProduct);
//             if (checkProduct === null) {
//                 resolve({
//                     status: "Error",
//                     message: "The Product is not defined",
//                 });
//             }

//             await Product.findByIdAndDelete(id);
//             resolve({
//                 status: "OK",
//                 message: "Delete product successfully",
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// const deleteManyProduct = (ids) => {
//     console.log("_ids: ", ids);
//     return new Promise(async (resolve, reject) => {
//         try {
//             await Product.deleteMany({ _id: ids });
//             resolve({
//                 status: "OK",
//                 message: "Delete product successfully",
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// const getAllProduct = (limit, page, sort, filter) => {
//     // console.log("sort", sort);
//     return new Promise(async (resolve, reject) => {
//         try {
//             const totalProduct = await Product.countDocuments();
//             let allProduct = [];
//             // console.log("filter", filter);
//             // Kiểm tra và áp dụng filter
//             if (filter) {
//                 const allProductFilter = await Product.find({
//                     [filter[0]]: { $regex: filter[1], $options: "i" },
//                 })
//                     .limit(limit)
//                     .skip(page * limit);
//                 resolve({
//                     status: "OK",
//                     message: " All product successfully",
//                     data: allProductFilter,
//                     total: totalProduct,
//                     pageCurrent: Number(page + 1),
//                     totalPage: Math.ceil(totalProduct / limit),
//                 });
//             }
//             // Kiểm tra và áp dụng sort
//             if (sort) {
//                 // console.log("oko");
//                 const objectSort = {};
//                 objectSort[sort[1]] = sort[0];
//                 // console.log("objectSort", objectSort);
//                 const allProductSort = await Product.find()
//                     .limit(limit)
//                     .skip(page * limit)
//                     .sort(objectSort);
//                 resolve({
//                     status: "OK",
//                     message: " All product successfully",
//                     data: allProductSort,
//                     total: totalProduct,
//                     pageCurrent: Number(page + 1),
//                     totalPage: Math.ceil(totalProduct / limit),
//                 });
//             }
//             if (!limit) {
//                 allProduct = await Product.find();
//             } else {
//                 // Nếu không có filter hoặc sort, lấy tất cả sản phẩm
//                 allProduct = await Product.find()
//                     .limit(limit)
//                     .skip(page * limit);
//             }

//             resolve({
//                 status: "OK",
//                 message: " All product successfully",
//                 data: allProduct,
//                 total: totalProduct,
//                 pageCurrent: Number(page + 1),
//                 totalPage: Math.ceil(totalProduct / limit),
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// const getDetailsProduct = (id) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const product = await Product.findOne({ _id: id }); //_id
//             if (product === null) {
//                 resolve({
//                     status: "Error",
//                     message: "The product is not defined",
//                 });
//             }

//             resolve({
//                 status: "OK",
//                 message: "Product successfully",
//                 data: product,
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

// const getAllTypes = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const allType = await Product.distinct("type");
//             resolve({
//                 status: "OK",
//                 message: "Type Product successfully",
//                 data: allType,
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

module.exports = {
    getAllRoomsService,
    createRoomService,
    updateRoomService,
    deleteRoomService,
    getRoomByRoomIdService,
    // createProduct,
    // updateProduct,
    // getDetailsProduct,
    // deleteProduct,
    // getAllProduct,
    // deleteManyProduct,
    // getAllTypes,
};

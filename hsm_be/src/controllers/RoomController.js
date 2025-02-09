// const ProductService = require("../services/ProductService");
const RoomService = require("../services/RoomService");

//get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await RoomService.getAllRoomsService();
        return res.status(200).json(rooms);
    } catch (e) {
        return res.status(404).json({
            error: e.message,
        });
    }
};

//get room by id
const getRoomByRoomId = async (req, res) => {
    try {
        const roomId = req.params.id;
        if (!roomId) {
            return res.status(200).json({
                status: "ERR",
                message: "The roomId is required",
            });
        }

        const room = await RoomService.getRoomByRoomIdService(roomId);
        return res.status(200).json(room);
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

//create a room
const createRooms = async (req, res) => {
    try {
        const {
            RoomName,
            Price,
            Status,
            Active,
            typerooms,
            locations,
            room_amenities,
            Discription,
            Image,
            IsDelete,
        } = req.body;
        console.log("req.body", req.body);
        if (
            !RoomName ||
            !Price ||
            !Status ||
            !Active ||
            !typerooms ||
            !locations ||
            !room_amenities
        ) {
            return res
                .status(200)
                .json({ status: "ERR", message: "The input is required." });
        }

        const room = await RoomService.createRoomService(req.body);
        return res.status(200).json(room);
    } catch (e) {
        return res.status(500).json({
            status: "ERROR",
            message: "Internal Server Error",
            error: e.message,
        });
    }
};

//update room by id
const updateRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const data = req.body;
        if (!roomId) {
            return res.status(200).json({
                status: "ERR",
                message: "The roomId is required",
            });
        }
        // console.log("roomId", roomId);
        const room = await RoomService.updateRoomService(roomId, data);
        return res.status(200).json(room);
    } catch (e) {
        return res.status(500).json({
            status: "ERROR",
            message: "Internal Server Error",
            error: e.message,
        });
    }
};

//delete room by id
const deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        if (!roomId) {
            return res.status(200).json({
                status: "ERR",
                message: "The roomId is required",
            });
        }
        const room = await RoomService.deleteRoomService(roomId);

        return res.status(200).json(room);
    } catch (e) {
        return res.status(404).json({
            message: "! Delete Product failed !",
            error: e.message,
        });
    }
};

// const updateProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const data = req.body;
//         if (!productId) {
//             return res.status(200).json({
//                 status: "ERR",
//                 message: "The productId is required",
//             });
//         }
//         // console.log("productId", productId);
//         const user = await ProductService.updateProduct(productId, data);

//         return res.status(200).json(user);
//     } catch (e) {
//         return res.status(404).json({
//             message: "! User updated failed !",
//             error: e.message,
//         });
//     }
// };

// const getDetailsProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;

//         if (!productId) {
//             return res.status(200).json({
//                 status: "ERR",
//                 message: "The productId is required",
//             });
//         }
//         const product = await ProductService.getDetailsProduct(productId);

//         return res.status(200).json(product);
//     } catch (e) {
//         return res.status(404).json({
//             message: "! User creation failed 'SOS'!",
//             error: e.message,
//         });
//     }
// };

// const deleteProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         if (!productId) {
//             return res.status(200).json({
//                 status: "ERR",
//                 message: "The productId is required",
//             });
//         }
//         const user = await ProductService.deleteProduct(productId);

//         return res.status(200).json(user);
//     } catch (e) {
//         return res.status(404).json({
//             message: "! Delete Product failed !",
//             error: e.message,
//         });
//     }
// };

// const deleteMany = async (req, res) => {
//     console.log("reqqqqqq", req.body);
//     try {
//         const ids = req.body.ids;

//         if (!ids) {
//             return res.status(200).json({
//                 status: "ERR",
//                 message: "The ids is required",
//             });
//         }
//         const user = await ProductService.deleteManyProduct(ids);

//         return res.status(200).json(user);
//     } catch (e) {
//         return res.status(404).json({
//             message: "! Delete Product failed !",
//             error: e.message,
//         });
//     }
// };

// const deleteMany = async (req, res) => {
//     console.log("Request Body:", req.body); // Log toàn bộ req.body
//     try {
//         const ids = req.body.ids;

//         // Kiểm tra nếu ids không tồn tại hoặc không phải là mảng
//         if (!ids || !Array.isArray(ids) || ids.length === 0) {
//             return res.status(200).json({
//                 status: "ERR",
//                 message:
//                     "The ids is required and should be an array with at least one element",
//             });
//         }

//         console.log("IDs to delete:", ids); // Log mảng ids

//         const result = await ProductService.deleteManyProduct(ids);

//         return res.status(200).json(result);
//     } catch (e) {
//         return res.status(404).json({
//             message: "! Delete Product failed !",
//             error: e.message,
//         });
//     }
// };

// const getAllProduct = async (req, res) => {
//     try {
//         const { limit, page, sort, filter } = req.query;
//         // console.log("req.query", req.query);
//         const product = await ProductService.getAllProduct(
//             Number(limit) || null,
//             Number(page) || 0,
//             sort,
//             filter
//         );
//         return res.status(200).json(product);
//     } catch (e) {
//         return res.status(404).json({
//             error: e.message,
//         });
//     }
// };

// const getAllTypes = async (req, res) => {
//     try {
//         const product = await ProductService.getAllTypes();
//         return res.status(200).json(product);
//     } catch (e) {
//         return res.status(404).json({
//             error: e.message,
//         });
//     }
// };

module.exports = {
    getAllRooms,
    createRooms,
    updateRoom,
    deleteRoom,
    getRoomByRoomId,
    // createProduct,
    // updateProduct,
    // getDetailsProduct,
    // deleteProduct,
    // getAllProduct,
    // deleteMany,
    // getAllTypes,
};

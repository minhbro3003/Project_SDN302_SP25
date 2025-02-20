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
            RoomName, Price, Status, Floor,
            roomtype, room_amenities, Description, Image
        } = req.body;
        console.log("req.body", req.body);
        if (!RoomName || !Price || !Floor) {
            return res.status(404).json({ status: "ERR", message: "The input is required." });
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

module.exports = {
    getAllRooms,
    createRooms,
    updateRoom,
    deleteRoom,
    getRoomByRoomId,
};

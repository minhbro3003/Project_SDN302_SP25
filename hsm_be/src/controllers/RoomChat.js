const RoomChatService = require("../services/RoomChat");

const getAllRoomChat = async (req, res) => {
    try {
        const roomchat = await RoomChatService.getAllRoomChat();
        return res.status(200).json(roomchat);
    } catch (e) {
        return res.status(404).json({
            error: e.message,
        });
    }
};


const getRoomChatById = async (req, res) => {
    try {
        const roomchatId = req.params.id;
        if (!roomchatId) {
            return res.status(200).json({
                status: "ERR",
                message: "The roomId is required",
            });
        }

        const roomchat = await RoomChatService.getRoomChat(roomchatId);
        return res.status(200).json(roomchat);
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

module.exports = {
    getAllRoomChat,
    getRoomChatById
};

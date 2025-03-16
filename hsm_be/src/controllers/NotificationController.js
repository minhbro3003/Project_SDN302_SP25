const NotificationService = require("../services/NotificationService");

// 📌 Lấy tin nhắn của nhân viên dọn dẹp
const getMessageForEmploy = async (req, res) => {
    try {
        const { id, chatroomId, type } = req.query;
        const messages = await NotificationService.getMessageForEmploy(id, chatroomId, type);
        res.status(200).json({
            status: "OK",
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
};

// 📌 Lấy tất cả tin nhắn
const getAllMess = async (req, res) => {
    try {
        const messages = await NotificationService.getAllMess();
        res.status(200).json({
            status: "OK",
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
};

// Tạo thông báo mới
const createNotification = async (req, res) => {
    try {
        const result = await NotificationService.createNotification(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
};

module.exports = {
    getMessageForEmploy,
    getAllMess,
    createNotification
};

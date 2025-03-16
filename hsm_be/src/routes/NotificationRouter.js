const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/NotificationController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

// Lấy tất cả tin nhắn
router.get("", notificationController.getAllMess);

// Lấy tin nhắn theo điều kiện
router.get("/messages", notificationController.getMessageForEmploy);

// Tạo thông báo mới
router.post("/create", notificationController.createNotification);

module.exports = router;
const housekeepingService = require("../services/HouseKeepingService");
// const mongoose = require('mongoose');
exports.createHousekeepingTask = async (req, res) => {
    try {
        const { roomId, assignedTo, taskType, notes } = req.body;
        const task = await housekeepingService.createHousekeepingTask(roomId, assignedTo, taskType, notes);
        res.status(201).json({ message: "Công việc được tạo", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateHousekeepingTask = async (req, res) => {
    try {
        // console.log("🔍 Debug Controller - Request params:", req.params);
        // console.log("🔍 Debug Controller - Request body:", req.body);
        
        const { taskId } = req.params;
        const { status, notes } = req.body;  // Đọc trường notes thay vì cancelNotes
        console.log("🔍 Debug Controller - Parsed data:", { taskId, status, notes });
        
        const updatedTask = await housekeepingService.updateHousekeepingTask(taskId, status, notes);
        res.status(200).json({ message: "Cập nhật thành công", updatedTask });
    } catch (error) {
        console.error("❌ Error in controller:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.cancelHousekeepingTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const cancelledTask = await housekeepingService.cancelHousekeepingTask(taskId);
        res.status(200).json({ message: "Đã hủy công việc", cancelledTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateRoomCleaningStatus = async (req, res) => {
    try {
        const { roomId, status, notes } = req.body;
        const result = await housekeepingService.updateRoomCleaningStatus(roomId, status, notes);
        res.status(200).json({ message: "Cập nhật thành công", result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHousekeepingLogs = async (req, res) => {
    try {
        const { roomId } = req.params;
        const logs = await housekeepingService.getHousekeepingLogs(roomId);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDirtyRooms = async (req, res) => {
    try {
        const rooms = await housekeepingService.getDirtyRooms();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getHousekeepingTasks = async (req, res) => {
    try {
        const { status, roomId, assignedTo } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (roomId) filter.room = roomId;
        if (assignedTo) filter.assignedTo = assignedTo;

        const tasks = await housekeepingService.getHousekeepingTasks(filter);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

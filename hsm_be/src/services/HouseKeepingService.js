const HousekeepingTask = require("../models/HouseKeepingModel");
const HousekeepingLog = require("../models/HouseKeepingLogModel");
const Room = require("../models/RoomModel");
const mongoose = require("mongoose");
async function createHousekeepingTask(roomId, assignedTo, taskType, notes) {
  try {
    console.log("🔍 Debug values:", { roomId, assignedTo, taskType, notes });

    if (!roomId || !assignedTo || !taskType) {
      throw new Error("Provide all information");
    }

    const existingTask = await HousekeepingTask.findOne({
        assignedTo,
        status: "In Progress",
      });
  
      if (existingTask) {
        throw new Error("You already have an unfinished task.");
      }

    const newTask = await HousekeepingTask.create({
      room: roomId,
      assignedTo,
      taskType,
      status: "In Progress",
      notes,
    });

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { Status: "Available - Cleaning" },
      { new: true }
    );

    if (!updatedRoom) {
      throw new Error(`Room with ID ${roomId} not found`);
    }

    return {
      taskId: newTask._id,
      message: "Housekeeping task created successfully",
    };
  } catch (error) {
    console.error("❌ Error in createHousekeepingTask:", error);
    throw error;
  }
}

async function updateHousekeepingTask(taskId, status, cancelNotes = "") {
  try {
    // 🔹 Tìm task theo ID
    // console.log("🔍 Raw parameters received:");
    // console.log("taskId:", taskId);
    // console.log("status:", status);
    // console.log("cancelNotes:", cancelNotes);
    // console.log("Type of cancelNotes:", typeof cancelNotes);
    // console.log("Length of cancelNotes:", cancelNotes ? cancelNotes.length : 0);
    const task = await HousekeepingTask.findById(taskId);

    if (!task) {
      throw new Error("Housekeeping task not found");
    }

    // 🔹 Cập nhật trạng thái task
    // Instead of conditional updating, do:
    if (status === "Cancelled") {
        // Kiểm tra cụ thể hơn để đảm bảo notes được lưu đúng
        const noteText = cancelNotes ? cancelNotes : "No reason provided";
        console.log("✅ Debug API: Cập nhật notes khi hủy:", noteText);

        await HousekeepingTask.findByIdAndUpdate(
            taskId, 
            { 
                status, 
                notes: `Cancelled Reason: ${noteText}` 
            },
            { new: true } 
        );
    } else {
        task.status = status;
        await task.save();
    }
    console.log(
      "🔍 Debug API: Task ID nhận được:",
      taskId,
      "Status:",
      status,
      "Notes:",
      cancelNotes
    );
    let updatedRoomStatus =
      status === "Completed" ? "Available" : "Available - Need Cleaning";

    // 🔹 Cập nhật trạng thái phòng
    const updatedRoom = await Room.findByIdAndUpdate(
      task.room,
      { Status: updatedRoomStatus },
      { new: true }
    );

    if (!updatedRoom) {
      throw new Error(`Room with ID ${task.room} not found or update failed.`);
    }

    return { message: "Housekeeping task updated successfully", task };
  } catch (error) {
    console.error("❌ Error in updateHousekeepingTask:", error);
    throw error;
  }
}

async function cancelHousekeepingTask(taskId) {
  const task = await HousekeepingTask.findById(taskId);
  if (!task) throw new Error("Không tìm thấy công việc");

  task.status = "Cancelled";
  await task.save();

  await Room.findByIdAndUpdate(task.room, {
    status: "Available - Need Cleaning",
  });
  return task;
}

async function getHousekeepingLogs(roomId) {
  return await HousekeepingLog.find({ roomId }).populate("staffId", "FullName");
}

async function getDirtyRooms() {
  return await Room.find({ Status: "Available - Need Cleaning" });
}
async function getHousekeepingTasks(filter = {}) {
  return await HousekeepingTask.find(filter)
    .populate("room", "number status")
    .populate("assignedTo", "Username");
}

module.exports = {
  createHousekeepingTask,
  updateHousekeepingTask,
  cancelHousekeepingTask,
  getDirtyRooms,
  getHousekeepingLogs,
  // updateRoomCleaningStatus,
  getHousekeepingTasks,
};

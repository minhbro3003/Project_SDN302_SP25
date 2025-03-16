const HousekeepingTask = require("../models/HouseKeepingModel");
const HousekeepingLog = require("../models/HouseKeepingLogModel");
const Room = require("../models/RoomModel");
const Hotel = require("../models/HotelModel");
const mongoose = require("mongoose");
async function createHousekeepingTask(roomId, assignedTo, taskType, notes, io) {
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
    console.log("🔍 New task created with ID:", newTask._id);
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { Status: "Available - Cleaning" },
      { new: true }
    );

    if (!updatedRoom) {
      throw new Error(`Room with ID ${roomId} not found`);
    }
    console.log("🔍 Số lượng client đang kết nối:", io.sockets.sockets.size);

    console.log("🔍 Server gửi taskUpdated tới tất cả client:", newTask);
    io.emit("taskUpdated", newTask);

    console.log("🔍 Server gửi roomUpdated tới tất cả client:", updatedRoom);
    io.emit("roomUpdated", updatedRoom);

    return {
      taskId: newTask._id,
      message: "Housekeeping task created successfully",
    };
  } catch (error) {
    console.error("❌ Error in createHousekeepingTask:", error);
    throw error;
  }
}

async function updateHousekeepingTask(taskId, status, cancelNotes = "", io) {
  try {

    const task = await HousekeepingTask.findById(taskId);

    if (!task) {
      throw new Error("Housekeeping task not found");
    }

    // 🔹 Cập nhật trạng thái task
    // Instead of conditional updating, do:
    let updatedTask;
    if (status === "Cancelled") {
      // Kiểm tra cụ thể hơn để đảm bảo notes được lưu đúng
      const noteText = cancelNotes ? cancelNotes : "No reason provided";
      console.log("✅ Debug API: Cập nhật notes khi hủy:", noteText);

      updatedTask = await HousekeepingTask.findByIdAndUpdate(
        taskId,
        {
          status,
          notes: `${noteText}`
        },
        { new: true }

      );
      console.log("🔍 Received taskId for update:", taskId);
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
    console.log("🔍 Số lượng client đang kết nối:", io.sockets.sockets.size);
    io.emit("taskUpdated", updatedTask); // Gửi task đã cập nhật tới tất cả client
    io.emit("roomUpdated", updatedRoom);
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
    .populate({
      path: "room",
      select: "RoomName Status",
      populate: {
        path: "hotel",
        select: "NameHotel LocationHotel",
      },
    })
    .populate("assignedTo", "Username");
}



// Lấy danh sách các khu vực (LocalHotels)
const getLocalHotels = async () => {
  try {
    return await Hotel.distinct("LocationHotel", { IsDelete: false });
  } catch (error) {
    throw new Error("Error fetching local hotels: " + error.message);
  }
};

// Lấy danh sách khách sạn theo khu vực đã chọn
const getHotelsByLocation = async (location) => {
  try {
    return await Hotel.find({ LocationHotel: location, IsDelete: false })
      .select("_id NameHotel LocationHotel");
  } catch (error) {
    throw new Error("Error fetching hotels by location: " + error.message);
  }
};

module.exports = {
  createHousekeepingTask,
  updateHousekeepingTask,
  cancelHousekeepingTask,
  getDirtyRooms,
  getHousekeepingLogs,
  // updateRoomCleaningStatus,
  getLocalHotels,
  getHousekeepingTasks,
  getHotelsByLocation,
};

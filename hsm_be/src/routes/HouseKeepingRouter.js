const express = require("express");
const router = express.Router();
const housekeepingController = require("../controllers/HouseKeepingController");

router.post("/create", housekeepingController.createHousekeepingTask);
router.put("/edit/:taskId", housekeepingController.updateHousekeepingTask);
router.put("/cancel/:taskId", housekeepingController.cancelHousekeepingTask);
// router.put("/cleaning-status/:id", housekeepingController.updateRoomCleaningStatus);
router.get("/logs/:roomId", housekeepingController.getHousekeepingLogs);
router.get("/dirty-rooms", housekeepingController.getDirtyRooms);
router.get("/list", housekeepingController.getHousekeepingTasks);

module.exports = router;
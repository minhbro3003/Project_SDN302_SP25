const express = require("express");
const router = express.Router();
// const productController = require("../controllers/ProductController");
const roomsController = require("../controllers/RoomController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

//router get all rooms
router.get("/get-all-rooms", roomsController.getAllRooms);
//router create new room
router.post("/create-room", roomsController.createRooms);
//router update by id
router.put("/update-room/:id", roomsController.updateRoom);
//delete room
router.delete("/delete-room/:id", roomsController.deleteRoom);
//router get room by id
router.get("/get-room-details/:id", roomsController.getRoomByRoomId);

// router.post("/create", productController.createProduct);
// router.put(
//     "/update-product/:id",
//     authMiddleware,
//     productController.updateProduct
// );
// router.get("/get-details/:id", productController.getDetailsProduct);
// router.delete(
//     "/delete-product/:id",
//     authMiddleware,
//     productController.deleteProduct
// );
// router.get("/get-all-product", productController.getAllProduct);
// router.post(
//     "/delete-many-product",
//     authMiddleware,
//     productController.deleteMany
// );
// router.get("/get-all-type", productController.getAllTypes);

module.exports = router;

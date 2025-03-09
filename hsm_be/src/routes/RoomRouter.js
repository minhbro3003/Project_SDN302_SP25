const express = require("express");
const router = express.Router();
// const productController = require("../controllers/ProductController");
const roomsController = require("../controllers/RoomController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

//router get all rooms
router.get("/", roomsController.getAllRooms);
//router create new room
router.post("", roomsController.createRooms);
//router update by id
router.put("/:id", roomsController.updateRoom);
//delete room
router.delete("/:id", roomsController.deleteRoom);
//router get room by id
router.get("/:id", roomsController.getRoomByRoomId);

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

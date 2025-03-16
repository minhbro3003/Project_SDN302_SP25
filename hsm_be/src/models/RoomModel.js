const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        RoomName: { type: String, required: true, trim: true },
        Price: { type: Number, required: true, min: 0 },
        Status: {
            type: String,
            enum: ["Available", "Booked"],
            default: "Available",
        },
        Floor: { type: Number, required: true },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },
        roomtype: {  // Sửa từ `typerooms` thành `roomtype`
            type: mongoose.Schema.Types.ObjectId,
            ref: "typerooms",
            required: true,
        },
        Description: { type: String, trim: true },
        Image: { type: String, required: true, trim: true }, // Chuyển thành chuỗi Base64
        IsDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        RoomName: { type: String, required: true, trim: true },
        Price: { type: Number, required: true, min: 0 },
        Status: {
            type: String,
            enum: ["Available", "Occupied", "Maintenance", "Booked"], // Có thể thêm trạng thái khác nếu cần
            default: "Available",
        },
        roomtype: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RoomType",
            required: true,
        },
        Discription: { type: String, trim: true },
        Image: [
            {
                url: { type: String, required: true, trim: true },
                alt: { type: String, trim: true },
            },
        ],
        IsDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

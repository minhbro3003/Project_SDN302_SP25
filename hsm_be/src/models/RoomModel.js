const mongoose = require("mongoose");
require("./TypeRoomModel");
require("./RoomAmenitiesModel");
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
        Description: { type: String, trim: true },
        roomtype: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RoomType",
            required: true,
        },
        Discription: { type: String, trim: true },
        Image: { type: String, trim: true },
        IsDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
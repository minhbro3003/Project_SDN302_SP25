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
        roomtype: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "roomtypes",
            required: true,
        },
        room_amenities: [
            {
                room_amenitiesID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "room_amenities",
                    // required: true,
                },
                quantity: { type: Number },
                status: { type: String, trim: true },
            }
        ],
        Description: { type: String, trim: true },
        Image: {
            type: String,
            trim: true,
        },
        IsDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
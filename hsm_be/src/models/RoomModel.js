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
        Active: { type: Boolean, default: true },
        typerooms: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "typerooms",
            required: true,
        },
        room_amenities: [
            {
                room_amenitiesID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "room_amenities",
                    required: true,
                },
                quantity: { type: Number, required: true },
                status: { type: String, trim: true },
            }
        ],
        Description: { type: String, trim: true },
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
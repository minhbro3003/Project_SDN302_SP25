const mongoose = require("mongoose");

const roomAmenitiesSchema = new mongoose.Schema(
    {
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        amenity: { type: mongoose.Schema.Types.ObjectId, ref: "Amenity", required: true },
        quantity: { type: Number, required: true, min: 1 },
        status: { type: String, enum: ["Functioning", "Broken", "Under Maintenance"], default: "Functioning" }
    },
    {
        timestamps: true,
    }
);

const RoomAmenity = mongoose.model("roomamenities", roomAmenitiesSchema);

module.exports = RoomAmenity;
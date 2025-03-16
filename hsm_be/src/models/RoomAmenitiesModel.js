const mongoose = require("mongoose");

const roomAmenitiesSchema = new mongoose.Schema(
    {
        AmenitiesName: { type: String, required: true, trim: true },
        Note:{ type: String, required: true, trim: true}
    }
);

const RoomAmenities = mongoose.model("room_amenities", roomAmenitiesSchema);

module.exports = RoomAmenities;

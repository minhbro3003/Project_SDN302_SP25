const mongoose = require("mongoose");

const amenitiesSchema = new mongoose.Schema(
    {
        AmenitiesName: { type: String, required: true, trim: true },
        Note: { type: String, required: true, trim: true }
    }
);

const Amenities = mongoose.model("room_amenities", amenitiesSchema);

module.exports = Amenities;
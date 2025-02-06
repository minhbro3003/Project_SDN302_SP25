const mongoose = require("mongoose");

const roomAmenitiesSchema = new mongoose.Schema(
    {
        AmenitiesName: { type: String, required: true, trim: true },
        Quality:{type:Number, required: true},
        Status: { type: Boolean, default: true }, // true = Active, false = Inactive
        Note:{ type: String, required: true, trim: true}
    }
);

const RoomAmenities = mongoose.model("RoomAmenities", roomAmenitiesSchema);

module.exports = RoomAmenities;

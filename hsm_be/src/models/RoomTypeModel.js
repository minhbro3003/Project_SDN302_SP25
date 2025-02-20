const mongoose = require("mongoose");

const RoomTypeSchema = new mongoose.Schema(
    {
        TypeName: { type: String, required: true, trim: true },
        Note: { type: String, required: true, trim: true }
    },
    {
        timestamps: true,
    }
);

const RoomType = mongoose.model("roomtypes", RoomTypeSchema);

module.exports = RoomType;
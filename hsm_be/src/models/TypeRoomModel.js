const mongoose = require("mongoose");

const typeRoomSchema = new mongoose.Schema(
    {
        TypeName: { type: String, required: true, trim: true },
        Note:{ type: String, required: true, trim: true}
    },
    {
        timestamps: true,
    }
);

const Typerooms = mongoose.model("roomtypes", typeRoomSchema);

module.exports = Typerooms;

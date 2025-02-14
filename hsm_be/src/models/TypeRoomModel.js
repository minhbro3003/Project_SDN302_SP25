const mongoose = require("mongoose");

const typeRoomSchema = new mongoose.Schema(
    {
        TypeName: { type: String, required: true, trim: true },
        Note: { type: String, required: true, trim: true }
    },
    {
        timestamps: true,
    }
);

const TypeRoom = mongoose.model("typerooms", typeRoomSchema);

module.exports = TypeRoom;
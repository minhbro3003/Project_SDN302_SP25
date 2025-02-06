const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        RoomName: { type: String, required: true, trim: true },
        Price: { type: Number, required: true, min: 0 },
        Status: { 
            type: String, 
            enum: ["Available", "Occupied", "Maintenance", "Booked"], // Có thể thêm trạng thái khác nếu cần
            default: "Available" 
        },
        Active: { type: Boolean, default: true }, 
        typerooms: { type: mongoose.Schema.Types.ObjectId, ref: "TypeRoom", required: true },
        locations: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
        room_amenities: { type: mongoose.Schema.Types.ObjectId, ref: "RoomAmenities", required: true },
        Discription: { type: String, trim: true }, 
        Image: [
            {
                url: { type: String, required: true, trim: true },
                alt: { type: String, trim: true },
            }
        ],
        IsDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true, 
    }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

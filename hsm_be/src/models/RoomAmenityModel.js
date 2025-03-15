const mongoose = require("mongoose");

const roomAmenitySchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", // Reference to the 'rooms' collection
        required: true,
    },
    amenity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity", // Reference to the 'amenities' collection
        required: true,
    },
    quantity: { type: Number, required: true },
    status: { type: String, required: true },
}, {
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            if (ret.room) {
                ret.RoomName = ret.room.RoomName;
                ret.Status = ret.room.Status;
                ret.Floor = ret.room.Floor;
            }
            if (ret.amenity) {
                ret.AmenitiesName = ret.amenity.AmenitiesName;
            }
            delete ret.room;
            delete ret.amenity;
            return ret;
        },
    },
    timestamps: true,
});

const RoomAmenity = mongoose.model("RoomAmenity", roomAmenitySchema);

module.exports = RoomAmenity;

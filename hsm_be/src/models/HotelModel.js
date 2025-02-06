const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
    {
        CodeHotel: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true 
        },
        NameHotel: { 
            type: String, 
            required: true, 
            trim: true 
        },
        Introduce: { 
            type: String, 
            trim: true 
        },
        Title: { 
            type: String, 
            trim: true 
        },
        LocationHotel: { 
            type: String, 
            required: true, 
            trim: true 
        },
        Note: { 
            type: String, 
            trim: true 
        },
        provinces: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Province",
                required: true
            }
        ],
        images: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Image"
            }
        ],
        rooms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room"
            }
        ],
        Active: { 
            type: Boolean, 
            default: true 
        },
        IsDelete: { 
            type: Boolean, 
            default: false 
        }
    },
    {
        timestamps: true
    }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;

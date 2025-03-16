const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customers: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        rooms: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        Time: {
            Checkin: { type: Date, required: true },
            Checkout: { type: Date, required: true },
        },
        SumPrice: { type: Number, required: true, min: 0 },
        Status: {
            type: String,
            enum: ["Completed", "Cancelled"],
            default: "Completed",
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

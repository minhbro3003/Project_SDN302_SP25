const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        ServiceName: { type: String, required: true, trim: true },
        Price: { type: Number, required: true },
        Note: { type: String, trim: true },
        Active: { type: Boolean, default: true },
        Quantity: { type: Number, required: true, min: 1 },
        IsDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        full_name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        cccd: { type: String, required: true, trim: true, unique: true },
    },
    {
        timestamps: true,
    }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;

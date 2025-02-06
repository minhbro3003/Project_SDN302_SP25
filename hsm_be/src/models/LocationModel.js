const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        LocationName: { type: String, required: true, trim: true },
        Note:{ type: String, required: true, trim: true}
    }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;

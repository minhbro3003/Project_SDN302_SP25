const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        LinkImage: { type: String, required: true, unique: true, trim: true },
        IsDelete: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;

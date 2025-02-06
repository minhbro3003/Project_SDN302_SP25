const mongoose = require("mongoose");

const provinceSchema = new mongoose.Schema(
    {
        CodeProvince: { type: String, required: true, trim: true },
        NameProvince: { type: String, required: true , unique: true},
        Note:{ type: String, required: true, trim: true},
        IsDelete:{ type: Boolean, default: false},
        images: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Image",
            required: true,
        }],
    },
    {
        timestamps: true,
    }
);

const Province = mongoose.model("Province", provinceSchema);

module.exports = Province;

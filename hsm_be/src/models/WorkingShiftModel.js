const mongoose = require("mongoose");

const workingShiftSchema = new mongoose.Schema(
    {
        working_shift: { type: String, required: true },
    }
);

const WorkingShift = mongoose.model("WorkingShift", workingShiftSchema);

module.exports = WorkingShift;

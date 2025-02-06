const mongoose = require("mongoose");

const employeeTypeSchema = new mongoose.Schema(
    {
        EmployeeType: { type: String, required: true },
    }
);

const EmployeeType = mongoose.model("EmployeeType", employeeTypeSchema);

module.exports = EmployeeType;

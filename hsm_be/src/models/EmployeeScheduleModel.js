const mongoose = require("mongoose");

const employeeScheduleSchema = new mongoose.Schema(
    {
        employees: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Employee", 
            required: true 
        },
        hotels: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Hotel", 
            required: true 
        },
        employee_types: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "EmployeeType", 
            required: true 
        },
        working_shifts: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "WorkingShift", 
            required: true 
        },
        schedule: [
            {
                date: { 
                    type: String, 
                    required: true 
                },
                start_time: { 
                    type: String, 
                    required: true 
                },
                end_time: { 
                    type: String, 
                    required: true 
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const EmployeeSchedule = mongoose.model("EmployeeSchedule", employeeScheduleSchema);

module.exports = EmployeeSchedule;

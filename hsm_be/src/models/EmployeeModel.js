const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true }],
        FullName: { type: String, required: true, trim: true },
        permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission", required: true }],
        Phone: { 
            type: String, 
            trim: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Chỉ chấp nhận số có đúng 10 chữ số
                },
                message: props => `${props.value} không phải là số điện thoại hợp lệ!`
            },
        },
        Email: { type: String, required: true, trim: true },
        Gender: { type: String, trim: true },
        Image: { type: String, trim: true },
        Address: { type: String, required: true, trim: true },

    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.model("employees", employeeSchema);

module.exports = Employee;

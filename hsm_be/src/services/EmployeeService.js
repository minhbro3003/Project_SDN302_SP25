const Employee = require("../models/EmployeeModel");

const EmployeeType = require("../models/EmployeeTypeModel");
const Permission = require("../models/PermissionModel");
const WorkingShift = require("../models/WorkingShiftModel");

const getAllEmployeeType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allEmployeeType = await EmployeeType.find();
            resolve({
                status: "OK",
                message: " All Employees successfully",
                data: allEmployeeType,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllPermission = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allPermission = await Permission.find();
            resolve({
                status: "OK",
                message: " All permission successfully",
                data: allPermission,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllWorkingShift = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allWorkingShift = await WorkingShift.find();
            resolve({
                status: "OK",
                message: " All WorkingShift successfully",
                data: allWorkingShift,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//tạo employee
const createEmployee = (newEmployee) => {
    return new Promise(async (resolve, reject) => {
        const { hotels, FullName, permissions, Phone, Email, Gender, Image, Address } = newEmployee;
        try {
            const checkEmployee = await Employee.findOne({ Email });

            if (checkEmployee !== null) {
                // Trả về lỗi với mã 400 khi email đã tồn tại
                return res.status(400).json({
                    status: "error",
                    message: "The email of employee already exists",
                });
            }

            const newEmployee = await Employee.create({
                hotels,
                FullName,
                permissions,
                Phone,
                Email,
                Gender,
                Image,
                Address
            });

            resolve({
                status: "OK",
                message: "Success",
                data: newEmployee,
            });
        } catch (e) {
            reject({
                status: "error",
                message: e.message || "Internal server error",
                code: 500
            });
        }
    });
};



module.exports = {
    getAllEmployeeType,
    getAllPermission,
    createEmployee,
    getAllWorkingShift
};
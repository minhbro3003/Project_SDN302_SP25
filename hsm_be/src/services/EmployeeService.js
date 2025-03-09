const Employee = require("../models/EmployeeModel");
const Hotel = require("../models/HotelModel");
const EmployeeType = require("../models/EmployeeTypeModel");
const Permission = require("../models/PermissionModel");
const Account = require("../models/AccountModel");

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

const getListEmployees = async () => {

    const employees = await Employee.find().populate("hotels").populate({
        path: "accountId", // Lấy thông tin tài khoản
        populate: {
            path: "permissions", // Lấy thông tin quyền
            model: "permissions",
        },
    }); // Load thông tin khách sạn từ bảng hotels

    return employees.map(emp => ({
        fullname: emp.FullName,
        email: emp.Email,
        phone: emp.Phone,

        position: emp.accountId && emp.accountId.permissions.length > 0
            ? emp.accountId.permissions.map(p => `${p.PermissionName}`).join(", ")
            : "No Position Assigned",

        area: emp.hotels.length > 0
            ? `${emp.hotels[0].NameHotel} - ${emp.hotels[0].LocationHotel}`
            : "No Hotel Assigned"
    }));
};

module.exports = {
    getAllEmployeeType,
    getAllPermission,
    createEmployee,
    getListEmployees
};
const EmployeeService = require("../services/EmployeeService");
const Employee = require("../models/EmployeeModel");


//get emnployee type
const getAllEmployeeType = async (req, res) => {
    try {
        const user = await EmployeeService.getAllEmployeeType();
        console.log('user');
        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json({
            message: "Employee Type not found",
            error: e.message,
        });
    }
};

//get all permissions

const getAllPermission = async (req, res) => {
    try {
        const permissions = await EmployeeService.getAllPermission();
        return res.status(200).json(permissions);
    } catch (e) {
        return res.status(404).json({
            message: "Employee Type not found",
            error: e.message,
        });
    }
};


const getAllWorkingShift = async (req, res) => {
    try {
        const working_shift = await EmployeeService.getAllWorkingShift();
        return res.status(200).json(working_shift);
    } catch (e) {
        return res.status(404).json({
            message: "WorkingShift not found",
            error: e.message,
        });
    }
};




const createEmployee = async (req, res) => {
    try {
        const {
            hotels,
            FullName,
            permissions,
            Phone,
            Email,
            Gender,
            Image,
            Address,


        } = req.body;
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isCheckEmail = mailformat.test(Email);
        // console.log("req.body", req.body);
        if (!FullName || !Phone || !Email || !Address) {
            return res
                .status(200)
                .json({ status: "ERR", message: "The input is required." });
        } else if (!isCheckEmail) {
            return res
                .status(200)
                .json({ status: "ERR", message: "The input is email." });
        }

        const employee = await EmployeeService.createEmployee(req.body);
        return res.status(200).json(employee);
    } catch (e) {
        return res.status(404).json({
            message: "Employee creation failed",
            error: e.message,
        });
    }
};

const listEmployees = async (req, res) => {
    try {
        const employees = await EmployeeService.getListEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error: error.message });
    }
};

const getEmployeeByAccountId = async (req, res) => {
    try {
        const accountId = req.params.id;

        const employee = await Employee.findOne({ accountId })
            .populate({
                path: 'hotels',
                select: 'NameHotel'
            })
            .populate({
                path: 'permission',
                select: 'PermissionName'
            });

        if (!employee) {
            return res.status(404).json({
                status: "ERR",
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            status: "OK",
            data: employee
        });
    } catch (error) {
        console.error("Error in getEmployeeByAccountId:", error);
        return res.status(500).json({
            status: "ERR",
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    getAllEmployeeType,
    getAllPermission,
    createEmployee,
    getAllWorkingShift,
    listEmployees,
    getEmployeeByAccountId
};
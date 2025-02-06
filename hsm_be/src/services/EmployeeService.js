const Employee = require("../models/EmployeeModel");

const createEmployee = (newEmployee) => {
    return new Promise(async (resolve, reject) => {
        const {
            FullName,
            Phone,
            Email,
            Gender,
            Image,
            Address
        } = newEmployee;
        try {
            const checkEmployee = await Employee.findOne({
                Email: Email,
            });
            if (checkEmployee !== null) {
                resolve({
                    status: "OK",
                    message: "The email of employee is already",
                });
            }

            // console.log("hash:", hash);
            const newEmployee = await Employee.create({
                FullName,
                Phone,
                Email,
                Gender,
                Image,
                Address

            });
            if (newEmployee) {
                resolve({
                    status: "OK",
                    message: "Success",
                    data: newEmployee,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

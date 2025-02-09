const EmployeeService = require("../services/EmployeeService");

const createEmployee = async (req, res) => {
    try {
        const {
            FullName,
            Phone,
            Email,
            Gender,
            Image,
            Address
        } = req.body;
        // console.log("req.body", req.body);
        if (!FullName || !Phone || !Email || !Address) {
            return res
                .status(200)
                .json({ status: "ERR", message: "The input is required." });
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
const express = require("express");
const router = express.Router();
const  employeeController = require("../controllers/EmployeeController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create-employee", employeeController.createEmployee);

module.exports = router;

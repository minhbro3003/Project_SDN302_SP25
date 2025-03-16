const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/EmployeeController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create-employee", employeeController.createEmployee);
router.get("/get-details/:id", employeeController.getDetailsEmployee);
router.put("/edit-employee/:id", employeeController.updateEmployeeController);
router.get("/list-employees", employeeController.listEmployees);
router.get("/account/:id", employeeController.getEmployeeByAccountId);

module.exports = router;

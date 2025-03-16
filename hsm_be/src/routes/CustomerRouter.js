const express = require("express");
const router = express.Router();
const customerController = require("../controllers/CustomerController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create-customer", customerController.createCustomer);

module.exports = router;
const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController");

// Get all customers
router.get("/", CustomerController.getAllCustomers);

// Get a single customer by ID
router.get("/:id", CustomerController.getCustomerById);

// Check if phone or CCCD exists
router.post("/check-exists", CustomerController.checkCustomerExists);

// Create a new customer
router.post("/", CustomerController.createCustomer);

// Update a customer by ID
router.put("/:id", CustomerController.updateCustomer);

// Delete a customer by ID
router.delete("/:id", CustomerController.deleteCustomer);

module.exports = router;

const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/TransactionController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all transactions
router.get("/"/*,authMiddleware*/, TransactionController.getAllTransactions);

// Get full transaction with everything in it
router.get("/full", TransactionController.getFullAllTransactions);

// Get a single transaction by ID
router.get("/:id"/*,authMiddleware*/, TransactionController.getTransactionById);

// Create a new transaction
router.post("/"/*,authMiddleware*/, TransactionController.createTransaction);

// Update a transaction by ID
router.put("/:id"/*,authMiddleware*/, TransactionController.updateTransaction);

// Delete a transaction by ID
router.delete("/:id"/*,authMiddleware*/, TransactionController.deleteTransaction);

module.exports = router;

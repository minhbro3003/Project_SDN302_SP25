const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/TransactionController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { createPaymentLink } = require("../controllers/VNPaymentController");
const { verifyPayment } = require("../controllers/VerifyPaymentController");

// Get all transactions
router.get("/"/*,authMiddleware*/, TransactionController.getAllTransactions);

router.post('/verifypayment', verifyPayment);
// Get full transaction with everything in it

// Get a single transaction by ID
router.get("/:id"/*,authMiddleware*/, TransactionController.getTransactionById);

// Create a new transaction
router.post("/"/*,authMiddleware*/, TransactionController.createBookingAndTransactionController);

// Update a transaction by ID
router.put("/:id"/*,authMiddleware*/, TransactionController.updateTransaction);

// Delete a transaction by ID
router.delete("/:id"/*,authMiddleware*/, TransactionController.deleteTransaction);

router.post('/create_payment_url', createPaymentLink);


module.exports = router;

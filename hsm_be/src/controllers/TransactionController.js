const TransactionService = require("../services/TransactionService");

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getAllTransactions();
        return res.status(200).json(transactions);
    } catch (e) {
        return res.status(500).json({
            message: "Failed to retrieve transactions",
            error: e.message,
        });
    }
};

// Get all transaction with everything intack
const getFullAllTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getFullAllTransactions();
        return res.status(200).json(transactions);
    } catch (e) {
        return res.status(500).json({
            message: "Failed to retrieve full transactions",
            error: e.message,
        });
    }
};


// Get a transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await TransactionService.getTransactionById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res.status(200).json(transaction);
    } catch (e) {
        return res.status(500).json({
            message: "Error retrieving transaction",
            error: e.message,
        });
    }
};

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const transaction = await TransactionService.createTransaction(req.body);
        return res.status(201).json(transaction);
    } catch (e) {
        return res.status(400).json({
            message: "Transaction creation failed",
            error: e.message,
        });
    }
};

// Update a transaction by ID
const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await TransactionService.updateTransaction(req.params.id, req.body);
        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res.status(200).json(updatedTransaction);
    } catch (e) {
        return res.status(400).json({
            message: "Transaction update failed",
            error: e.message,
        });
    }
};

// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await TransactionService.deleteTransaction(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (e) {
        return res.status(500).json({
            message: "Transaction deletion failed",
            error: e.message,
        });
    }
};

module.exports = {
    getAllTransactions,
    getFullAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};

const Transaction = require("../models/TransactionModel");
const Booking = require("../models/BookingModel");

// Get all transactions
const getAllTransactions = async () => {
    try {
        const allTransactions = await Transaction.find()
            .populate("bookings") // Populate booking details
            .populate("services"); // Populate service details

        return {
            status: "OK",
            message: "All transactions retrieved successfully",
            data: allTransactions,
        };
    } catch (error) {
        console.error("Error in getAllTransactions:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve transactions",
            error: error.message,
        };
    }
};

const getFullAllTransactions = async () => {
    try {
        const allTransactions = await Transaction.find()
            .populate({
                path: "bookings",
                populate: [
                    { path: "customers" }, // Populate customers inside bookings
                    { path: "rooms" }      // Populate rooms inside bookings
                ]
            })
            .populate("services"); // Populate service details

        return {
            status: "OK",
            message: "All transactions retrieved successfully",
            data: allTransactions,
        };
    } catch (error) {
        console.error("Error in getAllTransactions:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve transactions",
            error: error.message,
        };
    }
};



// Get a single transaction by ID
const getTransactionById = async (id) => {
    try {
        const transaction = await Transaction.findById(id)
            .populate("bookings") // Populate booking details
            .populate("services"); // Populate service details

        if (!transaction) {
            return {
                status: "ERR",
                message: "Transaction not found",
            };
        }

        return {
            status: "OK",
            message: "Transaction retrieved successfully",
            data: transaction,
        };
    } catch (error) {
        console.error("Error in getTransactionById:", error.message);
        return {
            status: "ERR",
            message: "Failed to retrieve transaction",
            error: error.message,
        };
    }
};


// Create a new transaction
const createTransaction = async (newTransaction) => {
    try {
        const { bookings, services, BuyTime, CreatedBy, PaidAmount = 0 } = newTransaction;

        if (!bookings || !bookings.length) {
            return {
                status: "ERR",
                message: "At least one booking is required to create a transaction",
            };
        }

        // Validate services and calculate total price
        let serviceTotal = 0;
        const formattedServices = services.map(service => {
            if (!service.serviceId || !service.quantity || !service.pricePerUnit) {
                throw new Error("Invalid service data. Each service must have serviceId, quantity, and pricePerUnit.");
            }
            const totalPrice = service.quantity * service.pricePerUnit;
            serviceTotal += totalPrice;
            return {
                serviceId: service.serviceId,
                quantity: service.quantity,
                pricePerUnit: service.pricePerUnit,
                totalPrice
            };
        });

        // Fetch bookings and calculate sum of booking prices
        const bookingDocs = await Booking.find({ _id: { $in: bookings } }, "SumPrice");
        const bookingTotal = bookingDocs.reduce((sum, booking) => sum + booking.SumPrice, 0);

        // Calculate FinalPrice
        const FinalPrice = bookingTotal + serviceTotal;

        // Determine payment status based on PaidAmount
        let PayStatus = "Unpaid";
        if (PaidAmount >= FinalPrice) {
            PayStatus = "Paid";
        } else if (PaidAmount > 0) {
            PayStatus = "Partial";
        }

        // Create transaction
        const transaction = new Transaction({
            bookings,
            services: formattedServices,
            BuyTime,
            FinalPrice,
            PaidAmount,  // New field to track how much has been paid
            Pay: PayStatus, // Updated payment status logic
            Status: "Pending", // Default status
            CreatedBy
        });

        const savedTransaction = await transaction.save();
        return {
            status: "OK",
            message: "Transaction created successfully",
            data: savedTransaction,
        };
    } catch (error) {
        console.error("Error in createTransaction:", error.message);
        return {
            status: "ERR",
            message: "Failed to create transaction",
            error: error.message,
        };
    }
};



// Update a transaction by ID
const updateTransaction = async (id, data) => {
    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return {
                status: "ERR",
                message: "Transaction not found",
            };
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(id, data, { new: true });
        return {
            status: "OK",
            message: "Transaction updated successfully",
            data: updatedTransaction,
        };
    } catch (error) {
        console.error("Error in updateTransaction:", error.message);
        return {
            status: "ERR",
            message: "Failed to update transaction",
            error: error.message,
        };
    }
};

// Delete a transaction by ID
const deleteTransaction = async (id) => {
    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return {
                status: "ERR",
                message: "Transaction not found",
            };
        }

        await Transaction.findByIdAndDelete(id);
        return {
            status: "OK",
            message: "Transaction deleted successfully",
        };
    } catch (error) {
        console.error("Error in deleteTransaction:", error.message);
        return {
            status: "ERR",
            message: "Failed to delete transaction",
            error: error.message,
        };
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

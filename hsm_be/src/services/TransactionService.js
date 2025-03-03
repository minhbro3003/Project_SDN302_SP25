const Transaction = require("../models/TransactionModel");
const Booking = require("../models/BookingModelRFA");
const Customer = require("../models/CustomerModel");
const Service = require("../models/ServiceModel");
const Room = require("../models/RoomModel");
const mongoose = require("mongoose");
const { createPaymentLinkAD } = require("../utils");
// Get all transactions //Used to display partial information about transaction - I don't recommend getting the full spaghetti just for the all
const getAllTransactions = async () => {
    try {
        const allTransactions = await Transaction.find()
            .populate({
                path: "bookings",
                populate: {
                    path: "rooms",
                    model: "Room",  // Explicitly define the model
                    select: "RoomName", // Only fetch RoomName
                }
            })
            .populate("services") // Populate service details
            .populate("customers");

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
        const { bookings, services, BuyTime, CreatedBy, PaidAmount = 0, PaymentReference } = newTransaction;

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
            PaymentReference,
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

const createBookingAndTransaction = async (bookingData, transactionData) => {
    try {
        if (!bookingData.customer) {
            throw new Error('Customer data is missing');
        }

        const { rooms, SumPrice, Status, checkin, checkout, customer } = bookingData;
        const { full_name, phone, cccd } = customer;

        if (!rooms || rooms.length === 0) {
            throw new Error('At least one room must be selected');
        }

        let existingCustomer = await Customer.findOne({ $or: [{ cccd }, { phone }] });

        if (existingCustomer) {
            if (existingCustomer.full_name !== full_name) {
                const newCustomer = new Customer({ full_name, phone, cccd });
                existingCustomer = await newCustomer.save();
            }
        } else {
            const newCustomer = new Customer({ full_name, phone, cccd });
            existingCustomer = await newCustomer.save();
        }

        // **Step 1: Update Room Status to "Booked"**
        await Room.updateMany(
            { _id: { $in: rooms }, Status: "Available" },
            { $set: { Status: "Available" } }
        );

        // **Step 2: Create a Booking**
        const newBooking = new Booking({
            customers: existingCustomer._id,
            SumPrice,
            Status,
            Time: {
                Checkin: new Date(checkin),
                Checkout: new Date(checkout),
            },
            rooms,
        });

        await newBooking.save();

        // **Step 3: Calculate Total Service Price**
        let totalServicePrice = 0;
        const transactionServices = [];

        for (const service of transactionData.services || []) {
            const serviceDetails = await Service.findById(service.serviceId);

            if (!serviceDetails) {
                throw new Error(`Service ${serviceDetails?.ServiceName || "Unknown"} is unavailable.`);
            }

            const pricePerUnit = serviceDetails.Price;
            const totalPrice = pricePerUnit * service.quantity;

            totalServicePrice += totalPrice;

            serviceDetails.Quantity -= service.quantity;
            await serviceDetails.save();

            transactionServices.push({
                serviceId: service.serviceId,
                quantity: service.quantity,
                pricePerUnit,
                totalPrice,
            });
        }

        // **Step 4: Create a Transaction**
        const finalPrice = (transactionData.FinalPrice || newBooking.SumPrice) + totalServicePrice;
        const paidAmount = transactionData.PaidAmount || 0;
        const paymentType = transactionData.paymentType;
        let payStatus = "Unpaid";
        if (paidAmount >= finalPrice) payStatus = "Paid";
        else if (paidAmount > 0) payStatus = "Partial";

        const newTransaction = new Transaction({
            bookings: [newBooking._id],
            services: transactionServices,
            BuyTime: new Date(),
            FinalPrice: finalPrice,
            PaidAmount: paidAmount,
            Pay: payStatus,
            Status: "Pending",
            PaymentMethod: transactionData.PaymentMethod || "Cash",
            CreatedBy: transactionData.CreatedBy,
        });

        const savedTransaction = await newTransaction.save(); // Save and get the transactionID
        const transactionID = savedTransaction._id;

        // **Step 5: Generate Payment Link (Only if Credit Card)**
        if (transactionData.PaymentMethod === "Credit Card") {
            let payAmount = finalPrice;

            if (transactionData.paymentType === "Partial Pay") {
                payAmount = Math.ceil(finalPrice * 0.3); // 30% of FinalPrice, rounded up
            }

            const paymentLink = createPaymentLinkAD(
                payAmount,
                `Thanh toán đơn ${transactionID}`,
                transactionData.ipAddr,
                transactionID
            );

            // **Step 6: Update Transaction with Payment Link**
            savedTransaction.PaymentReference = paymentLink;
            await savedTransaction.save();
        }

        return {
            status: "OK",
            message: "Booking and transaction created successfully",
            data: {
                booking: newBooking,
                transaction: savedTransaction,
                transactionID
            },
        };
    } catch (error) {
        console.error("Error in createBookingAndTransaction:", error.message);
        return {
            status: "ERR",
            message: "Failed to create booking and transaction",
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
    createBookingAndTransaction,
};

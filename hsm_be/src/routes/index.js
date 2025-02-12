const AccountRouter = require("./AccountRouter");
const RoomRouter = require("./RoomRouter");
const ServiceRouter = require("./ServiceRouter")
const BookingRouter = require("./BookingRouter");
const TransactionRouter = require("./TransactionRouter");
const CustomerRouter = require("./CustomerRouter");


const routes = (app) => {
    app.use("/api/account", AccountRouter);
    app.use("/api/rooms", RoomRouter);
    app.use("/api/services", ServiceRouter);
    app.use("/api/bookings", BookingRouter);
    app.use("/api/transactions", TransactionRouter);
    app.use("/api/customers", CustomerRouter);
};

module.exports = routes;

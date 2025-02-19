const AccountRouter = require("./AccountRouter");
const RoomRouter = require("./RoomRouter");
const ServiceRouter = require("./ServiceRouter")
const BookingRouter = require("./BookingRouterRFA");
const TransactionRouter = require("./TransactionRouter");
const CustomerRouter = require("./CustomerRouter");
const AmenityRouter = require("./AmenityRouter");
const RoomAmenityRouter = require("./RoomAmenityRouter");

const routes = (app) => {
    app.use("/api/account", AccountRouter);
    app.use("/api/rooms", RoomRouter);
    app.use("/api/services", ServiceRouter);
    app.use("/api/bookings", BookingRouter);
    app.use("/api/transactions", TransactionRouter);
    app.use("/api/customers", CustomerRouter);
    app.use("/api/amenities", AmenityRouter);
    app.use("/api/roomamenities", RoomAmenityRouter);
};

module.exports = routes;

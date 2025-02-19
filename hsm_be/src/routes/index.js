const AccountRouter = require("./AccountRouter");
const RoomRouter = require("./RoomRouter");
const RoomTypeRouter = require("./RoomTypeRouter");
const RoomAmenitiesRouter = require("./RoomAmenitiesRouter");
const EmployeeType = require("./EmployeeType");
const Hotel = require("./HotelRouter");
const Employee = require("./EmployeeRouter");
const EmployeeSchedule = require("./EmployeeScheduleRouter");
const ServiceRouter = require("./ServiceRouter")
const BookingRouter = require("./BookingRouterRFA");
const TransactionRouter = require("./TransactionRouter");
const CustomerRouter = require("./CustomerRouter");
const AmenityRouter = require("./AmenityRouter");
const RoomAmenityRouter = require("./RoomAmenityRouter");

const routes = (app) => {
    app.use("/api/account", AccountRouter);
    app.use("/api/rooms", RoomRouter);
    app.use("/api/rooms-type", RoomTypeRouter);
    app.use("/api/rooms-amenities", RoomAmenitiesRouter);
    app.use("/api/employee-type", EmployeeType);
    app.use("/api/hotel", Hotel);
    app.use("/api/employee", Employee);
    app.use("/api/employee-schedule", EmployeeSchedule);
    app.use("/api/services", ServiceRouter);
    app.use("/api/bookings", BookingRouter);
    app.use("/api/transactions", TransactionRouter);
    app.use("/api/customers", CustomerRouter);
    app.use("/api/amenities", AmenityRouter);
    app.use("/api/roomamenities", RoomAmenityRouter);
};

module.exports = routes;

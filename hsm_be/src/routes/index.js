const AccountRouter = require("./AccountRouter");
const RoomRouter = require("./RoomRouter");
const RoomTypeRouter = require("./RoomTypeRouter");
const RoomAmenitiesRouter = require("./RoomAmenitiesRouter");
const EmployeeType = require("./EmployeeType");
const Hotel = require("./HotelRouter");
const Employee = require("./EmployeeRouter");
const EmployeeSchedule = require("./EmployeeScheduleRouter");

const routes = (app) => {
    app.use("/api/account", AccountRouter);
    app.use("/api/rooms", RoomRouter);
    app.use("/api/roomtype", RoomTypeRouter);
    app.use("/api/rooms-amenities", RoomAmenitiesRouter);
    app.use("/api/employee-type", EmployeeType);
    app.use("/api/hotel", Hotel);
    app.use("/api/employee", Employee);
    app.use("/api/employee-schedule", EmployeeSchedule);
};

module.exports = routes;

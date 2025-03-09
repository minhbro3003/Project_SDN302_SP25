const AccountRouter = require("./AccountRouter");
const RoomRouter = require("./RoomRouter");
const EmployeeType = require("./EmployeeType");
const Hotel = require("./HotelRouter");
const Employee = require("./EmployeeRouter");
const EmployeeSchedule = require("./EmployeeScheduleRouter");
const HouseKeeping = require('./HouseKeepingRouter');

const routes = (app) => {
    app.use("/api/account", AccountRouter);
    app.use("/api/rooms", RoomRouter);
    app.use("/api/employee-type", EmployeeType);
    app.use("/api/hotel", Hotel);
    app.use("/api/employee", Employee);
    app.use("/api/employee-schedule", EmployeeSchedule);
    app.use("/api/housekeeping",HouseKeeping);
};

module.exports = routes;

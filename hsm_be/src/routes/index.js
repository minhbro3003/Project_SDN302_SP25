const AccountRouter = require("./AccountRouter");
const EmployeeType = require("./EmployeeType");
const Hotel= require("./HotelRouter");
const Employee = require("./EmployeeRouter");
const EmployeeSchedule = require("./EmployeeScheduleRouter");

const routes = (app) => {
    app.use("/api/account", AccountRouter);

    app.use("/api/employee-type", EmployeeType);
    app.use("/api/hotel", Hotel);
    app.use("/api/employee", Employee);

    app.use("/api/employee-schedule",EmployeeSchedule );
    
};

module.exports = routes;

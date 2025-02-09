const AccountRouter = require("./AccountRouter");
const RoomRouter = require("./RoomRouter");

const routes = (app) => {
    app.use("/api/account", AccountRouter);
    app.use("/api/rooms", RoomRouter);
};

module.exports = routes;

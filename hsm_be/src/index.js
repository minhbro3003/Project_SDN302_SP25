const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
dotenv.config();
const connectDB = require("../dbConnect/db");

const app = express();
const port = process.env.PORT || 9999;

//Cross-Origin Resource Sharing) là một cơ chế bảo mật trong trình duyệt mà ngăn không cho các trang web từ một nguồn (origin) khác truy cập tài nguyên từ một nguồn khác.
app.use(cors());
app.use(express.json({ limit: "2000mb" }));
app.use(express.urlencoded({ limit: "2000mb", extended: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Lưu trữ cookie

routes(app);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
    //Connect database
    connectDB();
});

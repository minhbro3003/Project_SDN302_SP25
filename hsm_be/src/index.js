const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configs/swagger');
const errorHandler = require('./middleware/errorHandler');
dotenv.config();
const connectDB = require("../dbConnect/db");

const app = express();
const port = process.env.PORT || 9999;

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));

//Cross-Origin Resource Sharing) là một cơ chế bảo mật trong trình duyệt mà ngăn không cho các trang web từ một nguồn (origin) khác truy cập tài nguyên từ một nguồn khác.
app.use(express.json({ limit: "2000mb" }));
app.use(express.urlencoded({ limit: "2000mb", extended: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Lưu trữ cookie

// Add swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
    },
}));

routes(app);

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
    connectDB();
});

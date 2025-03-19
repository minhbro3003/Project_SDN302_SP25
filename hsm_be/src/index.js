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

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const Notification = require("./models/Notification");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let chatMessages = []; // Lưu tin nhắn trong RAM
const janitors = new Set(); // Danh sách nhân viên dọn dẹp

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Tham gia vào room theo vai trò
    socket.on("join_role", (role) => {
        socket.join(role);
        console.log(`${socket.id} joined room: ${role}`);
    });

    // Khi nhân viên dọn dẹp tham gia
    socket.on("register", (role) => {
        if (role === "janitor") {
            janitors.add(socket.id);
        }
    });

    // Gửi thông báo đến Admin khi có booking mới
    socket.on("new_booking", async (data) => {
        try {
            const notification = new Notification({
                sender: data.sender || "Hệ thống",
                receiverRole: "Admin",
                message: data.message,
                type: "booking",
            });

            await notification.save();
            io.to("Admin").emit("receive_notification", notification);
        } catch (error) {
            console.error("Lỗi khi lưu thông báo:", error);
        }
    });

    // Gửi tin nhắn cũ khi user kết nối
    socket.on("get_messages", () => {
        socket.emit("load_messages", chatMessages);
    });

    // Nhận tin nhắn từ client
    socket.on("send_message", (data) => {
        console.log("📨 Tin nhắn từ client:", data);
        chatMessages.push(data);

        // Phát tin nhắn đến tất cả client ngay lập tức
        io.emit("receive_message", data);
    });


    // Khi nhân viên dọn dẹp rời khỏi
    socket.on("disconnect", () => {
        janitors.delete(socket.id);
        console.log("User disconnected", socket.id);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
    //Connect database
    connectDB();
});

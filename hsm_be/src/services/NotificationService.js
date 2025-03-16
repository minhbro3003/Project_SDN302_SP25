const Notification = require("../models/Notification");
const Account = require("../models/AccountModel");

class NotificationService {
    // 📌 Lấy tin nhắn của nhân viên dựa trên các điều kiện lọc
    static async getMessageForEmploy(id, chatroomId, type) {
        if (!id) throw new Error("Missing employeeId");

        // Kiểm tra tài khoản có tồn tại không
        const account = await Account.findById(id);
        if (!account) throw new Error("Account not found");

        // Xây dựng bộ lọc động
        let filter = { account: id };
        if (chatroomId) filter.chatroom = chatroomId;
        if (type) filter.type = type;

        // Lấy tin nhắn + populate thông tin tài khoản & chatroom
        return await Notification.find(filter)
            .populate("account", "FullName Email")
            .populate("chatroom", "name")
            .sort({ createdAt: -1 });
    }

    // Tạo thông báo mới
    static async createNotification(data) {
        try {
            const notification = new Notification({
                sender: data.sender,
                message: data.message,
                createdAt: data.createdAt || new Date(),
                type: data.type || "booking",
                receiverRole: "Admin"
            });

            const savedNotification = await notification.save();
            return {
                status: "OK",
                data: savedNotification
            };
        } catch (error) {
            console.error("Lỗi khi tạo thông báo:", error);
            throw error;
        }
    }
   
    static async getAllMess() {
        return await Notification.find()
            .sort({ createdAt: -1 });
    }
}

module.exports = NotificationService;

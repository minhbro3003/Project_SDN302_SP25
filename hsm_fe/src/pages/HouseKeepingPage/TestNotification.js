import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io("http://localhost:9999", { transports: ["websocket"] });

const TestNotification = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // Thêm state đếm tin nhắn chưa đọc

    const user = useSelector((state) => state.account);

    useEffect(() => {
        try {
            const storedMessages = JSON.parse(localStorage.getItem("chat_messages")) || [];
            setMessages(storedMessages);

            if (user) {
                socket.emit("register", user?.fullName || "Guest");
            }

            socket.emit("get_messages");

            socket.on("load_messages", (data) => {
                setMessages(data);
                localStorage.setItem("chat_messages", JSON.stringify(data));
            });

            socket.on("receive_message", (data) => {
                console.log("📩 Tin nhắn nhận từ server:", data);

                setMessages((prev) => {
                    if (!prev.some(msg => msg.timestamp === data.timestamp)) {
                        const updatedMessages = [...prev, data];
                        localStorage.setItem("chat_messages", JSON.stringify(updatedMessages));
                        return updatedMessages;
                    }
                    return prev;
                });

                // Nếu chưa mở chat, tăng số tin nhắn chưa đọc
                if (!isOpen) {
                    setUnreadCount((prev) => prev + 1);
                }
            });

            return () => {
                socket.off("load_messages");
                socket.off("receive_message");
            };
        } catch (error) {
            console.error("Lỗi khi kết nối WebSocket:", error);
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [isOpen, messages]);

    // Xử lý khi mở chat -> reset unreadCount về 0
    const toggleChat = () => {
        setIsOpen((prev) => {
            if (!prev) setUnreadCount(0); // Khi mở chat, số tin nhắn chưa đọc về 0
            return !prev;
        });
    };

    const sendMessage = () => {
        if (message.trim() !== "" && user) {
            const msgData = { sender: user.fullName, content: message, timestamp: new Date().toISOString() };

            setMessages(prev => {
                const updatedMessages = [...prev, msgData];
                localStorage.setItem("chat_messages", JSON.stringify(updatedMessages));
                return updatedMessages;
            });

            socket.emit("send_message", msgData);
            setMessage("");
        }
    };

    return (
        <div>
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    backgroundColor: "orange",
                    color: "white",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)"
                }}
                onClick={toggleChat}
            >
                {!isOpen && ( // Chỉ hiển thị khi chat chưa mở
                    <>
                        <span style={{ marginRight: "10px" }}>
                            Bạn có <span style={{color:"red",fontSize:"20px"}}>{unreadCount}</span> tin nhắn mới!
                        </span>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQchVHkgc9oJ8hD_H5nioWD8KhtghObbPYO4A&s"
                            alt="bot"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                border: "2px solid white"
                            }}
                        />
                    </>
                )}
            </div>

            {isOpen && (
                <div style={{
                    position: "fixed",
                    bottom: "80px",
                    right: "20px",
                    padding: "15px",
                    maxWidth: "350px",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                    marginBottom:"-70px"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px"
                    }}>
                        <h2 style={{ fontSize: "18px", margin: 0 }}>🔹 Chat Nhóm</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold"
                            }}
                        >
                            ✖
                        </button>
                    </div>

                    <div style={{
                        border: "1px solid gray",
                        padding: "10px",
                        height: "350px",
                        overflowY: "auto",
                        backgroundColor: "#fff",
                        borderRadius: "5px",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: msg.sender === user?.fullName ? "flex-end" : "flex-start",
                                    margin: "5px 0"
                                }}
                            >
                                <div style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: msg.sender === user?.fullName ? "#007bff" : "#555",
                                    marginBottom: "3px"
                                }}>
                                    {msg.sender}
                                </div>
                                <div style={{
                                    maxWidth: "75%",
                                    backgroundColor: msg.sender === user?.fullName ? "#007bff" : "#e9ecef",
                                    color: msg.sender === user?.fullName ? "white" : "black",
                                    fontSize: "14px",
                                    padding: "8px",
                                    borderRadius: "10px",
                                    textAlign: "left",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word"
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                fontSize: "14px"
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "5px",
                                backgroundColor: "blue",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            <i className="bi bi-send-arrow-up-fill"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default TestNotification;

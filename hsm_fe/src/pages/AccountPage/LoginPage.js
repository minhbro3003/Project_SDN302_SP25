import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button } from "antd";
import { updateAccount } from "../../redux/accountSlice";
import { loginAccount } from "../../services/accountService";
import "./Login.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => loginAccount(data),
        onSuccess: (data) => {
            if (data.status === "OK") {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                dispatch(updateAccount({ ...data.user, access_token: data.access_token, refresh_token: data.refresh_token }));
                navigate("/dashboard");
            } else {
                console.error("Login failed:", data.message);
            }
        },
        onError: (error) => {
            console.error("System error:", error.message);
        },
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        mutation.mutate(formData);
    };

    return (
        <div className="container">
            <div className="login-box">
                {/* Left Section (Image Placeholder) */}
                <div className="image-section">
                    <div className="image-placeholder">
                        <img
                            src="https://du-lich.chudu24.com/f/m/2207/08/khach-san-lamor-boutique-10.jpg?w=550&c=1"
                            alt="Placeholder"
                            className="image-icon"
                        />
                    </div>
                    <h3 style={{ color: "red" }}>LẤY CÁI REPOSITORY MỚI NHẤT VỀ HỘ TÔI RỒI MỚI CODE ;V - Ở TRÊN BRANCH CỦA MÌNH - FETCH - OPEN IN COMMAND PROMPT - git merge develop </h3>
                </div>
                {/* Right Section (Login Form) */}
                <div className="form-section">
                    <Card title="Đăng Nhập" className="login-card">
                        <Form ref={formRef} layout="vertical" onFinish={handleSubmit}>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                                <Input placeholder="Nhập email" name="email" value={formData.email} onChange={handleOnChange} />
                            </Form.Item>

                            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                                <Input.Password placeholder="Nhập mật khẩu" name="password" value={formData.password} onChange={handleOnChange} />
                            </Form.Item>

                            {mutation?.data?.status === "ERR" && (
                                <span style={{ color: "red" }}>{mutation?.data?.message}</span>
                            )}

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={mutation.isLoading} block>
                                    Đăng Nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

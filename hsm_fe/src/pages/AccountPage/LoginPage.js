import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button } from "antd";
import { updateAccount } from "../../redux/accountSlice";
import { loginAccount } from "../../services/accountService";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "", // Changed to lowercase "email"
        password: "", // Changed to lowercase "password"
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
        <Card
            title="Đăng Nhập"
            style={{ width: 400, margin: "auto", marginTop: 50 }}
        >
            <Form ref={formRef} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Email"
                    name="email" // Changed to "email"
                    rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                    <Input
                        placeholder="Nhập email"
                        name="email" // Changed to lowercase "email"
                        value={formData.email}
                        onChange={handleOnChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password" // Changed to "password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu"
                        name="password" // Changed to lowercase "password"
                        value={formData.password}
                        onChange={handleOnChange}
                    />
                </Form.Item>

                {mutation?.data?.status === "ERR" && (
                    <span style={{ color: "red" }}>{mutation?.data?.message}</span>
                )}

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={mutation.isLoading}
                        block
                    >
                        Đăng Nhập
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoginPage;

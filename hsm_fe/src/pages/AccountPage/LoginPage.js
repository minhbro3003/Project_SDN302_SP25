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

    const [captcha, setCaptcha] = useState(true);

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
        <div className="login-page__container">

            <Card
                title={<>
                    <h2 className="title">Welcome to PHM System</h2>
                    <p className="subtitle">Login to continue</p>
                </>
                }
                style={{ width: 600, margin: "auto", marginTop: "15%", padding: "20px", borderRadius: "28px" }}
            >
                <Form ref={formRef} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Username"
                        name="email" // Changed to "email"
                        rules={[{ required: true, message: "Please enter your username!" }]}
                    >
                        <Input
                            placeholder="Nhập email"
                            name="email" // Changed to lowercase "email"
                            value={formData.email}
                            onChange={handleOnChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password" // Changed to "password"
                        rules={[{ required: true, message: "Please enter your password!" }]}
                    >
                        <Input.Password
                            placeholder="Enter password"
                            name="password" // Changed to lowercase "password"
                            value={formData.password}
                            onChange={handleOnChange}
                        />
                    </Form.Item>

                    {mutation?.data?.status === "ERR" && (
                        <span style={{ color: "red" }}>{mutation?.data?.message}</span>
                    )}

                    <div className="forgot-password">
                        <a href="#">Forgot password?</a>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={mutation.isLoading}
                            block
                            disabled={mutation.isLoading || !captcha}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;

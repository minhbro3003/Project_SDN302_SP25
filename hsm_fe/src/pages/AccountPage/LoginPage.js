import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { updateAccount } from "../../redux/accountSlice";
import { loginAccount } from "../../services/accountService";
import {
    LoginContainer,
    LoginCard,
    Title,
    Subtitle,
    StyledInput,
    StyledPasswordInput,
    StyledButton,
    ForgotPassword,
    CaptchaContainer,
    CaptchaCheckboxContainer,
    CaptchaCheckbox,
    CaptchaText,
    CaptchaImage,
} from "./style";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [captcha, setCaptcha] = useState(false);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => loginAccount(data),
        onSuccess: (data) => {
            if (data.status === "OK") {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                dispatch(
                    updateAccount({
                        ...data.user,
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
                    })
                );

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
        <LoginContainer>
            <LoginCard title={<><Title>Welcome to PHM System</Title><Subtitle>Login to continue</Subtitle></>}>
                <Form ref={formRef} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
                        <StyledInput placeholder="Nhập email" name="email" value={formData.email} onChange={handleOnChange} />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
                        <StyledPasswordInput placeholder="Enter password" name="password" value={formData.password} onChange={handleOnChange} />
                    </Form.Item>

                    {mutation?.data?.status === "ERR" && (
                        <span style={{ color: "red" }}>{mutation?.data?.message}</span>
                    )}

                    <ForgotPassword>
                        <a href="#">Forgot password?</a>
                    </ForgotPassword>

                    <CaptchaContainer>
                        <CaptchaCheckboxContainer>
                            <CaptchaCheckbox type="checkbox" checked={captcha} onChange={(e) => setCaptcha(e.target.checked)} />
                            <CaptchaText>I'm not a robot</CaptchaText>
                        </CaptchaCheckboxContainer>
                        <CaptchaImage src={require("../../asset/img/recaptcha-icon.png")} alt="Captcha" />
                    </CaptchaContainer>

                    <Form.Item>
                        <StyledButton type="primary" htmlType="submit" loading={mutation.isLoading} disabled={mutation.isLoading || !captcha}>
                            Login
                        </StyledButton>
                    </Form.Item>
                </Form>
            </LoginCard>
        </LoginContainer>
    );
};

export default LoginPage;

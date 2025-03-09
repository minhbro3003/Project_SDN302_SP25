import React from "react";
import "./Login.css"; // Import file CSS riêng

const LoginPage = () => {
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
                </div>

                {/* Right Section (Login Form) */}
                <div className="form-section">
                    <h2 className="title">Welcome to PHM System</h2>
                    <p className="subtitle">Login to continue</p>

                    <form>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" placeholder="Phone number" />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" placeholder="Password" />
                            <div className="forgot-password">
                                <a href="#">Forgot password?</a>
                            </div>
                        </div>

                        <button className="login-button">Login</button>
                    </form>

                    <div className="separator">
                        <hr />
                        <span>or</span>
                        <hr />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

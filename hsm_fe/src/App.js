import React, { useState, useEffect, Fragment } from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import { HomeOutlined, UserOutlined, BarChartOutlined, ProfileOutlined, LockOutlined, TableOutlined, FileTextOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardOverview from './pages/Dashboard/Dashboard';
import EmployeesPage from './pages/EmployeesPage/EmployeesPage';
import RevenuePage from './pages/RevenuePage/RevenuePage';
import BookingLogsPage from './pages/BookingPage/BookingPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import RoomPage from './pages/RoomPage/RoomPage';
import HomePage from './pages/HomePage/HomePage';
import SubMenu from 'antd/es/menu/SubMenu';
import AddEmployees from './pages/EmployeesPage/AddEmployees/AddEmployee';
import AccountPage from './pages/AccountPage/AccountPage';

import * as AccountService from "./services/accountService";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserSevice";
import { useDispatch, useSelector } from "react-redux";
import { routes } from './routes/routes';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { resetAccount, updateAccount } from './redux/accountSlice';
import { persistStore } from 'redux-persist';
import { store } from './redux/store';


const { Sider, Content, Header } = Layout;


const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const account = useSelector((state) => state.account);
    const publicRoutes = ["/login"];
    const userPermissions = account?.permissions || [];


    useEffect(() => {
        if (publicRoutes.includes(location.pathname)) return; // Skip check on login page

        const checkToken = () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("Token removed, logging out...");
                dispatch(resetAccount());
                navigate("/login");
            }
        };
        const interval = setInterval(checkToken, 2000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [dispatch, navigate, location]);

    useEffect(() => {
        if (publicRoutes.includes(location.pathname)) return; // Skip check on login page
        if (account?.id) return; // 
    
        const handleAuthCheck = async () => {
            const { storageData, decoded } = handleDecoded();
    
            if (!storageData || !decoded?.id) {
                console.warn("No valid token found, redirecting to login...");
                dispatch(resetAccount());
                navigate("/login");
                return;
            }
    
            console.log("User authenticated. Fetching account details...");
            await handleGetDetailsAccount(decoded.id, storageData);
        };
    
        handleAuthCheck();
    }, [account?.id, dispatch, navigate]);

    const handleDecoded = () => {
        let storageData = account?.access_token || localStorage.getItem("access_token");
        let decoded = {};

        try {
            if (storageData) {
                if (isJsonString(storageData)) {
                    const parsedData = JSON.parse(storageData);
                    storageData = parsedData.access_token || parsedData;
                }

                decoded = jwtDecode(storageData);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }

        return { decoded, storageData };
    };

    AccountService.axiosJWT.interceptors.request.use(
        async (config) => {
            const currentTime = new Date().getTime() / 1000;
            const { decoded } = handleDecoded();
            let storageRefreshToken = localStorage.getItem("refresh_token");

            const refreshToken = storageRefreshToken;
            const decodedRefreshToken = jwtDecode(refreshToken);
            if (decoded?.exp < currentTime) {
                if (decodedRefreshToken?.exp > currentTime) {
                    const data = await AccountService.refreshToken(refreshToken);
                    config.headers["token"] = `Bearer ${data?.access_token}`;
                } else {
                    dispatch(resetAccount());
                }
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    const handleGetDetailsAccount = async (id, token) => {
        try {
            let storageRefreshToken = localStorage.getItem("refresh_token");
            const refreshToken = storageRefreshToken;
            const res = await AccountService.getDetailsAccount(id, token);

            if (res?.data) {
                dispatch(
                    updateAccount({
                        ...res.data,
                        access_token: token,
                        refreshToken: refreshToken,
                    })
                );
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Routes>
                {routes.map((route) => {
                    const Page = route.page;
                    const showLayout = route.isShowHeader; // Check if we should show header/sidebar

                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                showLayout ? (
                                    <Layout>
                                        {/* HEADER */}
                                        <Header
                                            style={{
                                                background: "#79D7BE",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "0 27px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "20px",
                                                    fontWeight: "bold",
                                                    color: "#00363D",
                                                }}
                                            >
                                                PHM System
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "16px",
                                                }}
                                            >
                                                <Button
                                                    type="text"
                                                    style={{ color: "#00363D" }}
                                                    onClick={() => {
                                                        dispatch(resetAccount());  // Clear user data
                                                        localStorage.removeItem("access_token"); // Remove token
                                                        localStorage.removeItem("refresh_token"); // Remove refresh token
                                                        persistStore(store).flush().then(() => {
                                                            return persistStore(store).purge();})
                                                        
                                                        navigate("/login"); // Redirect to login page
                                                    }}
                                                >
                                                    Logout
                                                </Button>

                                                <Avatar
                                                    style={{ backgroundColor: "#00363D" }}
                                                    icon={<UserOutlined />}
                                                />
                                            </div>
                                        </Header>

                                        {/* SIDEBAR */}
                                        <Layout>
                                            <Sider width={190} style={{ background: "#79D7BE", borderRadius: "5px" }}>
                                                <Menu mode="inline" defaultSelectedKeys={["dashboard"]} style={{ background: "#79D7BE", color: "#00363D", fontSize: "16px" }}>
                                                    {routes
                                                        .filter(route => route.isShowHeader && (!route.permissions || route.permissions.some(p => userPermissions.includes(p))))
                                                        .map(route => (
                                                            <Menu.Item key={route.path || route.name} icon={<HomeOutlined style={{ color: "#00363D" }} />}>
                                                                <Link to={route.path}>{route.name}</Link>
                                                            </Menu.Item>
                                                        ))}
                                                </Menu>
                                            </Sider>

                                            {/* MAIN CONTENT */}
                                            <Layout>
                                                <Content style={{ padding: "17px", background: "#fff" }}>
                                                    <Page />
                                                </Content>
                                            </Layout>
                                        </Layout>
                                    </Layout>
                                ) : (
                                    // No Header or Sidebar if `isShowHeader` is false
                                    <Page />
                                )
                            }
                        />
                    );
                })}
                {/* Fallback for unknown routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Layout>
    );
};

export default App;
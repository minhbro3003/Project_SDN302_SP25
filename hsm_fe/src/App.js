import React from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import { HomeOutlined, UserOutlined, BarChartOutlined, ProfileOutlined, LockOutlined, TableOutlined, FileTextOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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


const { Sider, Content, Header } = Layout;

const App = () => {

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Header
                    style={{
                        background: '#79D7BE',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 27px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#00363D',
                        }}
                    >
                        PHM System
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <Button type="text" style={{ color: '#00363D' }}>
                            Login
                        </Button>
                        <Avatar
                            style={{ backgroundColor: '#00363D' }}
                            icon={<UserOutlined />}
                        />
                    </div>
                </Header>
                <Layout>
                    <Sider
                        width={190}
                        style={{
                            background: '#79D7BE',
                            borderRadius: '5px',
                        }}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['dashboard']}
                            style={{
                                background: '#79D7BE',
                                color: '#00363D',
                                fontSize: '16px',
                            }}
                        >
                            <Menu.Item key="dashboard" icon={<HomeOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/dashboard">Dashboard</Link>
                            </Menu.Item>
                            <SubMenu
                                key="employees"
                                icon={<UserOutlined style={{ color: '#00363D' }} />}
                                title="Employees"
                            >
                                <Menu.Item key="add-employee">
                                    <Link to="/employees/add">Add Employee</Link>
                                </Menu.Item>
                                <Menu.Item key="employee-detail">
                                    <Link to="/employees/detail">Employee Detail</Link>
                                </Menu.Item>
                            </SubMenu>
                            <Menu.Item key="revenue" icon={<BarChartOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/revenue">Revenue</Link>
                            </Menu.Item>
                            <Menu.Item key="booking-log" icon={<FileTextOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/booking-log">Booking Log</Link>
                            </Menu.Item>
                            <Menu.Item key="profile" icon={<ProfileOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/profile">Profile</Link>
                            </Menu.Item>
                            <Menu.Item key="room-list" icon={<TableOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/room-list">Room List</Link>
                            </Menu.Item>
                            <Menu.Item key="logout" icon={<LockOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/dashboard">Logout</Link>
                            </Menu.Item>
                            <Menu.Item key="home" icon={<HomeOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/home">Home</Link>
                            </Menu.Item>
                            <Menu.Item key="account" icon={<HomeOutlined style={{ color: '#00363D' }} />}>
                                <Link to="/account">Account</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content style={{ padding: '17px', background: '#fff' }}>
                            <Routes>
                                <Route path="/dashboard" element={<DashboardOverview />} />
                                <Route path="/employees/add" element={<AddEmployees />} />
                                <Route path="/revenue" element={<RevenuePage />} />
                                <Route path="/booking-log" element={<BookingLogsPage />} />
                                <Route path="/room-list" element={<RoomPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/account" element={<AccountPage/>} />
                                <Route path="/" element={<div>Select an option from the menu</div>} />
                            </Routes>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </Router>
    );
};

export default App;

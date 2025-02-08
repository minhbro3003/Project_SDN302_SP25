import AccountPage from "../pages/AccountPage/AccountPage";
import LoginPage from "../pages/AccountPage/LoginPage";
import BookingPage from "../pages/BookingPage/BookingPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddEmployees from "../pages/EmployeesPage/AddEmployees/AddEmployee";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import RevenuePage from "../pages/RevenuePage/RevenuePage";
import RoomForm from "../pages/RoomPage/AddRoom";
import RoomDashboard from "../pages/RoomPage/RoomDashboard";
import EmployeesPage from "../pages/EmployeesPage/EmployeesPage";
import {SettingOutlined, AppstoreAddOutlined, HomeOutlined } from '@ant-design/icons';


export const routes = [
    {
        path: "/",
        name: "Login",
        page: LoginPage,
        icon: <SettingOutlined />,
        isShowHeader: false,
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        page: Dashboard,
        isShowHeader: true,
        icon: <HomeOutlined />,
        permissions: ["Admin", "Receptionist", "Janitor"], // Accessible by all
    },
    {
        path: "/login",
        name: "login",
        page: LoginPage,
        icon: <SettingOutlined />,
        isShowHeader: false,
    },
    {
        path: "/employees",
        name: "Employee",
        isShowHeader: true,
        permissions: ["Admin"],
        children: [
            {
                path: "/employees/add",
                name: "Add Employee",
                isShowHeader: true,
                icon: <AppstoreAddOutlined />,
                page: AddEmployees,
                permissions: ["Admin"],
            },
            {
                path: "/employees/details",
                name: "Employee Details",
                isShowHeader: true,
                page: EmployeesPage,
                icon: <AppstoreAddOutlined />,
                permissions: ["Admin"],
            },
        ],
    },
    {
        path: "/revenue",
        name: "Revenue",
        page: RevenuePage,
        isShowHeader: true,
        icon: <SettingOutlined />,
        permissions: ["Admin"],
    },
    {
        path: "/booking-log",
        name: "Booking Log",
        page: BookingPage,
        isShowHeader: true,
        icon: <SettingOutlined />,
        permissions: ["Admin", "Receptionist"],
    },
    {
        path: "/room-dashboard",
        name: "Room Dashboard",
        isShowHeader: true,
        permissions: ["Admin"],
        icon: <SettingOutlined />,
        children: [
            {
                path: "/room-dashboard/add-room",
                name: "Add Room",
                isShowHeader: true,
                icon: <AppstoreAddOutlined />,
                page: RoomForm,
                permissions: ["Admin"],
            },
            {
                path: "/room-dashboard/room-list",
                name: "Room List",
                isShowHeader: true,
                page: RoomDashboard,
                icon: <AppstoreAddOutlined />,
                permissions: ["Admin"],
            },
        ],
    },
    {
        path: "/profile",
        name: "Profile",
        page: ProfilePage,
        isShowHeader: true,
        icon: <HomeOutlined />,
        permissions: ["Admin", "Receptionist", "Janitor"],
    },
    {
        path: "/home",
        name: "Home",
        page: HomePage,
        isShowHeader: true,
        icon: <HomeOutlined />,
        permissions: ["Admin", "Receptionist", "Janitor"],
    },
    {
        path: "/account",
        name: "Account",
        page: AccountPage,
        isShowHeader: true,
        icon: <HomeOutlined />,
        permissions: ["Admin"],
    },
    {
        path: "*",
        page: NotFoundPage,
    },
];


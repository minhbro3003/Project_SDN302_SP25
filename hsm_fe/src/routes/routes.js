import AccountPage from "../pages/AccountPage/AccountPage";
import LoginPage from "../pages/AccountPage/LoginPage";
import BookingPage from "../pages/BookingPage/BookingPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddEmployees from "../pages/EmployeesPage/AddEmployees/AddEmployee";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import RevenuePage from "../pages/RevenuePage/RevenuePage";
import AddRoom from "../pages/RoomPage/AddRoom";
import RoomDashboard from "../pages/RoomPage/RoomDashboard";
import {SettingOutlined, AppstoreAddOutlined, HomeOutlined, BarChartOutlined, LineChartOutlined, PlusCircleOutlined, TableOutlined } from '@ant-design/icons';
import RoomList from "../pages/RoomPage/RoomList";
import EmployeesPage from "../pages/EmployeesPage/EmployeesPage";
import EmployeeDetail from "../pages/EmployeesPage/EmployeeDetail/EmployeeDetail";
import TestNotification from "../pages/EmployeesPage/EmployeeDetail/TestNotification"
import BookingHistory from "../pages/BookingPage/BookingHistory";



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
        permissions: ["Admin", "Receptionist", "Janitor"],
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
            {
                path: "/employee-details/:id",
                name: "Employee Detail",
                page: EmployeeDetail,
                isShowHeader: true,
                icon: <SettingOutlined />,
                permissions: ["Admin", "Receptionist"],
            },
            {
                path: "/testnotifications",
                name: "Test Notification",
                page: TestNotification,
                isShowHeader: true,
                icon: <SettingOutlined />,
                permissions: ["Receptionist", "Janitor"],
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
        path: "/booking",
        name: "Booking",
        page: BookingPage,
        isShowHeader: true,
        icon: <SettingOutlined />,
        permissions: [ "Receptionist"],
    },
    {
        path: "/booking-history",
        name: "Booking History",
        page: BookingHistory,
        isShowHeader: true,
        icon: <SettingOutlined />,
        permissions: ["Admin"],
    },
    {
        path: "/rooms",
        name: "Rooms",
        isShowHeader: true,
        permissions: ["Admin"],
        icon: <BarChartOutlined />,
        children: [
            {
                path: "/rooms/room-dashboard",
                name: "Room Dashboard",
                isShowHeader: true,
                page: RoomDashboard,
                icon: <LineChartOutlined />,
                permissions: ["Admin"],
            },
            {
                path: "/rooms/add-room",
                name: "Add Room",
                isShowHeader: true,
                icon: <PlusCircleOutlined />,
                page: RoomList,
                permissions: ["Admin"],
            },
            {
                path: "/rooms/room-list",
                name: "Room List",
                isShowHeader: true,
                page: AddRoom,
                icon: <TableOutlined />,
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


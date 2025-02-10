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
import {
    SettingOutlined,
    AppstoreAddOutlined,
    HomeOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PlusCircleOutlined,
    TableOutlined,
    BankOutlined,
    ProfileOutlined,
    BorderOuterOutlined,
} from "@ant-design/icons";
import RoomList from "../pages/RoomPage/RoomList";
import EmployeesPage from "../pages/EmployeesPage/EmployeesPage";
import EmployeeDetail from "../pages/EmployeesPage/EmployeeDetail/EmployeeDetail";
import HotelList from "../pages/HotelPage/HotelList";
import AddHotel from "../pages/HotelPage/AddHotel";

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
        roles: ["Admin", "Employee", "Janitor"], // Accessible by all
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
        roles: ["Admin"],
        children: [
            {
                path: "/employees/add",
                name: "Add Employee",
                isShowHeader: true,
                icon: <AppstoreAddOutlined />,
                page: AddEmployees,
                roles: ["Admin"],
            },
            {
                path: "/employees/details",
                name: "Employee Details",
                isShowHeader: true,
                page: EmployeesPage,
                icon: <AppstoreAddOutlined />,
                roles: ["Admin"],
            },
            {
                path: "/employee-detail",
                name: "Employee Detail",
                page: EmployeeDetail,
                isShowHeader: true,
                icon: <SettingOutlined />,
                roles: ["Admin", "Employee"],
            },
        ],
    },
    {
        path: "/revenue",
        name: "Revenue",
        page: RevenuePage,
        isShowHeader: true,
        icon: <SettingOutlined />,
        roles: ["Admin"],
    },
    {
        path: "/booking-log",
        name: "Booking Log",
        page: BookingPage,
        isShowHeader: true,
        icon: <SettingOutlined />,
        roles: ["Admin", "Employee"],
    },
    {
        path: "/hotel",
        name: "Hotel",
        isShowHeader: true,
        roles: ["Admin"],
        icon: <BankOutlined  />,
        children: [
            {
                path: "/hotel/room-list",
                name: "Hotel List",
                isShowHeader: true,
                icon: <ProfileOutlined />,
                page: HotelList,
                roles: ["Admin"],
            },
            {
                path: "/hotel/add-room",
                name: "Add Hotel",
                isShowHeader: true,
                page: AddHotel,
                icon: <BorderOuterOutlined />,
                roles: ["Admin"],
            },
        ],
    },
    {
        path: "/rooms",
        name: "Rooms",
        isShowHeader: true,
        roles: ["Admin"],
        icon: <BarChartOutlined />,
        children: [
            {
                path: "/rooms/room-dashboard",
                name: "Room Dashboard",
                isShowHeader: true,
                page: RoomDashboard,
                icon: <LineChartOutlined />,
                roles: ["Admin"],
            },
            {
                path: "/rooms/room-list",
                name: "Room List",
                isShowHeader: true,
                icon: <PlusCircleOutlined />,
                page: RoomList,
                roles: ["Admin"],
            },
            {
                path: "/rooms/add-room",
                name: "Add Room",
                isShowHeader: true,
                page: AddRoom,
                icon: <TableOutlined />,
                roles: ["Admin"],
            },
        ],
    },
    {
        path: "/profile",
        name: "Profile",
        page: ProfilePage,
        isShowHeader: true,
        icon: <HomeOutlined />,
        roles: ["Admin", "Employee", "Janitor"],
    },
    {
        path: "/home",
        name: "Home",
        page: HomePage,
        isShowHeader: true,
        icon: <HomeOutlined />,
        roles: ["Admin", "Employee", "Janitor"],
    },
    {
        path: "/account",
        name: "Account",
        page: AccountPage,
        isShowHeader: true,
        icon: <HomeOutlined />,
        roles: ["Admin"],
    },
    {
        path: "*",
        page: NotFoundPage,
    },
];

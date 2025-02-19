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
import { SettingOutlined, AppstoreAddOutlined, HomeOutlined, BarChartOutlined, LineChartOutlined, PlusCircleOutlined, TableOutlined, BorderOuterOutlined, ProfileOutlined, BankOutlined } from '@ant-design/icons';
import RoomList from "../pages/RoomPage/RoomList";
import EmployeesPage from "../pages/EmployeesPage/EmployeesPage";
import EmployeeDetail from "../pages/EmployeesPage/EmployeeDetail/EmployeeDetail";
import AddHotel from "../pages/HotelPage/AddHotel";
import HotelList from "../pages/HotelPage/HotelList";
import ReservationPage from "../pages/ReservationPage/ReservationPage";
import ReservationList from "../pages/ReservationPage/ReservationListPage";
import VerificationPage from "../pages/ReservationPage/VerificationPayment";



export const routes = [
    {
        path: "/",
        name: "Login",
        page: LoginPage,
        isShowHeader: false,
    },
    {
        path: "/verification",
        name: "Verification Payment",
        page: VerificationPage,
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
                permissions: ["Admin", "Receptionist", "Janitor"],
            },
            {
                path: "/employees/details",
                name: "Employee Details",
                isShowHeader: true,
                page: EmployeesPage,
                icon: <AppstoreAddOutlined />,
                permissions: ["Admin", "Receptionist", "Janitor"],
            },
            {
                path: "/employee-detail",
                name: "Employee Detail",
                page: EmployeeDetail,
                isShowHeader: true,
                icon: <SettingOutlined />,
                permissions: ["Admin", "Receptionist", "Janitor"],
            },
        ],
    },
    {
        path: "/revenue",
        name: "Revenue",
        page: RevenuePage,
        isShowHeader: true,
        icon: <SettingOutlined />,
        permissions: ["Admin", "Receptionist", "Janitor"],
    },
    {
        path: "/booking-log",
        name: "Booking Log",
        page: BookingPage,
        isShowHeader: true,
        icon: <SettingOutlined />,
        permissions: ["Admin", "Receptionist", "Janitor"],
    },
    {
        path: "/hotel",
        name: "Hotel",
        isShowHeader: true,
        roles: ["Admin"],
        icon: <BankOutlined />,
        children: [
            {
                path: "/hotel/hotel-list",
                name: "Hotel List",
                isShowHeader: true,
                icon: <ProfileOutlined />,
                page: HotelList,
                roles: ["Admin"],
            },
            {
                path: "/hotel/add-hotel",
                name: "Add Hotel",
                isShowHeader: true,
                page: AddHotel,
                icon: <BorderOuterOutlined />,
                roles: ["Admin"],
            },
        ],
    },
    {
        path: "/reservations",
        name: "Reservation",
        isShowHeader: true,
        permissions: ["Admin", "Receptionist", "Janitor"],
        icon: <BarChartOutlined />,
        children: [{
            path: "/createreservation",
            name: "Create Reservation",
            page: ReservationPage,
            isShowHeader: true,
            icon: <HomeOutlined />,
            permissions: ["Admin", "Receptionist", "Janitor"],
        }, {
            path: "/reservationlist",
            name: "Reservation History",
            page: ReservationList,
            isShowHeader: true,
            icon: <HomeOutlined />,
            permissions: ["Admin", "Receptionist", "Janitor"],
        }
        ]
    },
    {
        path: "/rooms",
        name: "Rooms",
        isShowHeader: true,
        permissions: ["Admin", "Receptionist", "Janitor"],
        icon: <BarChartOutlined />,
        children: [
            {
                path: "/rooms/room-dashboard",
                name: "Room Dashboard",
                isShowHeader: true,
                page: RoomDashboard,
                icon: <LineChartOutlined />,
                permissions: ["Admin", "Receptionist", "Janitor"],
            },
            {
                path: "/rooms/room-list",
                name: "Room List",
                isShowHeader: true,
                page: RoomList,
                icon: <TableOutlined />,
                permissions: ["Admin", "Receptionist", "Janitor"],
            },
            {
                path: "/rooms/add-room",
                name: "Add Room",
                isShowHeader: true,
                icon: <PlusCircleOutlined />,
                page: AddRoom,
                permissions: ["Admin", "Receptionist", "Janitor"],
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
        permissions: ["Admin", "Receptionist", "Janitor"],
    },
    {
        path: "*",
        page: NotFoundPage,
    },
];


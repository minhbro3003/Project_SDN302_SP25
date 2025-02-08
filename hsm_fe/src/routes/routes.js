import AccountPage from "../pages/AccountPage/AccountPage";
import LoginPage from "../pages/AccountPage/LoginPage";
import BookingPage from "../pages/BookingPage/BookingPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddEmployees from "../pages/EmployeesPage/AddEmployees/AddEmployee";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import RevenuePage from "../pages/RevenuePage/RevenuePage";
import RoomDashboard from "../pages/RoomPage/RoomDashboard";
import EmployeesPage from "../pages/EmployeesPage/EmployeesPage";


export const routes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        page: Dashboard,
        isShowHeader: true,
        permissions: ["Admin", "Receptionist", "Janitor"], // Accessible by all
    },
    {
        path: "/login",
        name: "login",
        page: LoginPage,
        isShowHeader: false,
    },
    {
        path: "/employees/add",
        name: "Employee",
        page: AddEmployees,
        isShowHeader: true,
        parentPath: '/employees',
        permissions: ["Admin"],
    },
    {
        path: "/employees",
        name: "Employee",
        page: EmployeesPage,
        isShowHeader: true,
        permissions: ["Admin"],
    },
    {
        path: "/revenue",
        name: "Revenue",
        page: RevenuePage,
        isShowHeader: true,
        permissions: ["Admin"],
    },
    {
        path: "/booking-log",
        name: "Booking Log",
        page: BookingPage,
        isShowHeader: true,
        permissions: ["Admin", "Receptionist"],
    },
    {
        path: "/room-dashboard",
        name: "Room dashboard",
        page: RoomDashboard,
        isShowHeader: true,
        permissions: ["Admin"],
    },
    {
        path: "/profile",
        name: "Profile",
        page: ProfilePage,
        isShowHeader: true,
        permissions: ["Admin", "Receptionist", "Janitor"],
    },
    {
        path: "/home",
        name: "Home",
        page: HomePage,
        isShowHeader: true,
        permissions: ["Admin", "Receptionist", "Janitor"],
    },
    {
        path: "/account",
        name: "Account",
        page: AccountPage,
        isShowHeader: true,
        permissions: ["Admin"],
    },
    {
        path: "*",
        page: NotFoundPage,
    },
];


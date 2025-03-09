const Transaction = require("../models/TransactionModel");
const Room = require("../models/RoomModel");
const Employee = require("../models/EmployeeModel");
const Hotel = require("../models/HotelModel");
const Booking = require("../models/BookingModelRFA");

const getDashboardData = async (employeeId, permission) => {
    try {
        console.log("Getting dashboard data for:", { employeeId, permission });

        const employee = await Employee.findById(employeeId).populate('hotels');
        if (!employee) {
            console.log("Employee not found:", employeeId);
            return {
                status: "ERR",
                message: "Employee not found"
            };
        }
        console.log("Found employee:", {
            id: employee._id,
            name: employee.FullName,
            hotelCount: employee.hotels?.length
        });

        const hotelIds = employee.hotels.map(hotel => hotel._id);
        console.log("Hotel IDs:", hotelIds);

        // Base metrics object
        let dashboardData = {
            metrics: {},
            recentTransactions: [],
            roomStatus: {},
            employeeStats: {},
            hotelStats: {}
        };

        // Admin gets full access to all data
        if (permission === "Admin") {
            console.log("Fetching admin dashboard data");
            // Get all hotels data
            const allHotels = await Hotel.find();
            const allRooms = await Room.find();
            const allEmployees = await Employee.find().populate('permission');
            const allTransactions = await Transaction.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('bookings');

            dashboardData = {
                metrics: {
                    totalHotels: allHotels.length,
                    totalRooms: allRooms.length,
                    totalEmployees: allEmployees.length,
                    totalBookings: await Booking.countDocuments()
                },
                recentTransactions: allTransactions,
                roomStatus: {
                    available: await Room.countDocuments({ Status: "Available" }),
                    needCleaning: await Room.countDocuments({ Status: "Available - Need Cleaning" }),
                    cleaning: await Room.countDocuments({ Status: "Available - Cleaning" })
                },
                employeeStats: {
                    byRole: {
                        managers: allEmployees.filter(emp => emp.permission?.PermissionName === "Hotel-Manager").length,
                        receptionists: allEmployees.filter(emp => emp.permission?.PermissionName === "Receptionist").length,
                        janitors: allEmployees.filter(emp => emp.permission?.PermissionName === "Janitor").length
                    }
                },
                hotelStats: await Promise.all(allHotels.map(async hotel => ({
                    hotelId: hotel._id,
                    name: hotel.NameHotel,
                    totalRooms: await Room.countDocuments({ hotel: hotel._id }),
                    availableRooms: await Room.countDocuments({ hotel: hotel._id, Status: "Available" })
                })))
            };
            console.log("Admin dashboard data prepared:", {
                totalHotels: dashboardData.metrics.totalHotels,
                totalRooms: dashboardData.metrics.totalRooms,
                totalEmployees: dashboardData.metrics.totalEmployees
            });
        }
        // Hotel Manager sees their hotel's data
        else if (permission === "Hotel-Manager") {
            const hotelRooms = await Room.find({ hotel: { $in: hotelIds } });
            const hotelEmployees = await Employee.find({ hotels: { $in: hotelIds } }).populate('permission');
            const hotelTransactions = await Transaction.find({
                'bookings.rooms.hotel': { $in: hotelIds }
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('bookings');

            dashboardData = {
                metrics: {
                    totalRooms: hotelRooms.length,
                    totalEmployees: hotelEmployees.length,
                    totalBookings: await Booking.countDocuments({ 'rooms.hotel': { $in: hotelIds } })
                },
                recentTransactions: hotelTransactions,
                roomStatus: {
                    available: await Room.countDocuments({ hotel: { $in: hotelIds }, Status: "Available" }),
                    needCleaning: await Room.countDocuments({ hotel: { $in: hotelIds }, Status: "Available - Need Cleaning" }),
                    cleaning: await Room.countDocuments({ hotel: { $in: hotelIds }, Status: "Available - Cleaning" })
                },
                employeeStats: {
                    byRole: {
                        receptionists: hotelEmployees.filter(emp => emp.permission?.PermissionName === "Receptionist").length,
                        janitors: hotelEmployees.filter(emp => emp.permission?.PermissionName === "Janitor").length
                    }
                }
            };
        }
        // Receptionist sees basic hotel stats and booking info
        else if (permission === "Receptionist") {
            const hotelRooms = await Room.find({ hotel: { $in: hotelIds } });
            const recentBookings = await Booking.find({ 'rooms.hotel': { $in: hotelIds } })
                .sort({ createdAt: -1 })
                .limit(5);

            dashboardData = {
                metrics: {
                    totalRooms: hotelRooms.length,
                    availableRooms: await Room.countDocuments({ hotel: { $in: hotelIds }, Status: "Available" }),
                    todayCheckIns: await Booking.countDocuments({
                        'rooms.hotel': { $in: hotelIds },
                        'Time.Checkin': {
                            $gte: new Date().setHours(0, 0, 0, 0),
                            $lt: new Date().setHours(23, 59, 59, 999)
                        }
                    })
                },
                recentBookings: recentBookings,
                roomStatus: {
                    available: await Room.countDocuments({ hotel: { $in: hotelIds }, Status: "Available" }),
                    needCleaning: await Room.countDocuments({ hotel: { $in: hotelIds }, Status: "Available - Need Cleaning" }),
                    cleaning: await Room.countDocuments({ hotel: { $in: hotelIds }, Status: "Available - Cleaning" })
                }
            };
        }
        // Janitor sees cleaning-related information
        else if (permission === "Janitor") {
            dashboardData = {
                metrics: {
                    totalRoomsToClean: await Room.countDocuments({
                        hotel: { $in: hotelIds },
                        Status: "Available - Need Cleaning"
                    }),
                    roomsCleaning: await Room.countDocuments({
                        hotel: { $in: hotelIds },
                        Status: "Available - Cleaning"
                    })
                },
                roomsNeedingCleaning: await Room.find({
                    hotel: { $in: hotelIds },
                    Status: "Available - Need Cleaning"
                }).select('RoomName Floor')
            };
        }

        return {
            status: "OK",
            message: "Dashboard data retrieved successfully",
            data: dashboardData
        };
    } catch (error) {
        console.error("Error in getDashboardData:", error);
        return {
            status: "ERR",
            message: "Failed to retrieve dashboard data",
            error: error.message
        };
    }
};

module.exports = {
    getDashboardData
}; 
// roomService.js
import axios from "axios";

export const getAvailableRooms = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/rooms/getavail`);
        return response.data; // Return the available rooms data
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        return { status: "ERR", message: error.response?.data?.message || "Failed to fetch available rooms" };
    }
};


import axios from "axios";

export const createBooking = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/booking/create-booking`,
            data
        );
        return res.data;
    } catch (error) {
        return { status: "ERR", message: error.response?.data?.message };
    }
};

export const getAllBooking = async (data) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL_BACKEND}/booking/get-all-booking`,
            data
        );
        return res.data;
    } catch (error) {
        return { status: "ERR", message: error.response?.data?.message };
    }
};
export const getAllBookingsByHotelId = async (hotelId) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL_BACKEND}/booking/hotel/${hotelId}`
        );
        console.log("Data từ API:", res.data);
        return res.data;  // Thêm dòng này
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.response?.data || error.message);
        return null; // Trả về null nếu có lỗi
    }
};

console.log("API URL:", process.env.REACT_APP_API_URL_BACKEND);
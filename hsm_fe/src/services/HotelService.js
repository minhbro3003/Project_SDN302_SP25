import { IdcardFilled } from "@ant-design/icons";
import axios from "axios";


export const getAllHotel = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/hotel/get-all-hotel`,
        data
      
    );
    console.log("data",data);
    return res.data;
};
export const getHotelByRoomId = async (id) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL_BACKEND}/hotel/by-room/${id}`
        );

        console.log("Hotel data:", res.data);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy khách sạn theo roomId:", error);
        throw error;
    }
};

console.log("API URL:", process.env.REACT_APP_API_URL_BACKEND);
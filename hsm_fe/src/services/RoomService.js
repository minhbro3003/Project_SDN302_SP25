import axios from "axios";

export const getAllTypeRoom = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms/get-all-typeroom`,
        data
      
    );
    console.log("data",data);
    return res.data;
};
export const getAllRoom = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms`,
        data
      
    );
    console.log("data",data);
    return res.data;
};
export const getAllRoomByHotelId = async (id) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms/hotel/${id}`
    );
    return res.data;
};

console.log("API URL:", process.env.REACT_APP_API_URL_BACKEND);
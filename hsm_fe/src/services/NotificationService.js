import axios from "axios";

export const createNotification = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/notification/create`,
            data
        );
        return res.data;
    } catch (error) {
        return { status: "ERR", message: error.response?.data?.message };
    }
};
export const getAllNotification = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/notification`,
        data
      
    );
    console.log("data",data);
    return res.data;
};

console.log("API URL:", process.env.REACT_APP_API_URL_BACKEND);
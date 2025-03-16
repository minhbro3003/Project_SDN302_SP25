import axios from "axios";

export const createCustomer = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/customer/create-customer`,
            data
        );
        return res.data;
    } catch (error) {
        return { status: "ERR", message: error.response?.data?.message };
    }
};
console.log("API URL:", process.env.REACT_APP_API_URL_BACKEND);
import axios from "axios";

export const createAccount = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/account/create`,
            data
        );
        return res.data;
    } catch (error) {
        return { status: "ERR", message: error.response?.data?.message };
    }
};
console.log("API URL:", process.env.REACT_APP_API_URL_BACKEND);
export const createProduct = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/account/create`,
        data
    );
    return res.data;
};

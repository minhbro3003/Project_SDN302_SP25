import axios from "axios";


export const getAllRoom = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms`,
        data

    );
    console.log("res getAllRoom:", res);
    return res.data;
};
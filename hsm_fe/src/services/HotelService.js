import axios from "axios";

export const getAllHotel = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/hotel`,
        data
    );
    console.log("res getAllHotel:", res);
    return res.data;
};

export const createHotel = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/hotel`,
        data

    );
    console.log("res createHotel:", res);
    return res.data;
};
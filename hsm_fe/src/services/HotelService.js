import axios from "axios";


export const getAllHotel = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/hotel/get-all-hotel`,
        data
      
    );
    console.log("data",data);
    return res.data;
};
console.log("API URL:", process.env.REACT_APP_API_URL_BACKEND);
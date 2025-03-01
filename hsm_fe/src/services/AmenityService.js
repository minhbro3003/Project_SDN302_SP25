import axios from "axios";

export const getAllAmenities = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/amenities`,
        data

    );
    // console.log("res getAllAmenities:", res);
    return res.data;
};

export const getAmenityById = async (id) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/amenities/${id}`
    );
    console.log("res getById:", res);
    return res.data;
};

export const createAmenity = async (data) => {
    console.log("data createAmenity:", data);
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/amenities`,
        data
    );
    console.log("res createAmenity:", res);
    return res.data;
};

export const updateAmenity = async (id, access_token, data) => {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL_BACKEND}/amenities/${id}`,
        data,
        // {
        //     headers: {
        //         token: `Bearer: ${access_token}`,
        //     },
        // }
    );
    console.log("res updateAmenity:", res);
    return res.data;
};

export const deleteAmenity = async (id, access_token) => {
    const res = await axios.delete(
        `${process.env.REACT_APP_API_URL_BACKEND}/amenities/${id}`,
        // {
        //     headers: {
        //         token: `Bearer: ${access_token}`,
        //     },
        // }
    );
    console.log("res deleteAmenity:", res);
    return res.data;
};

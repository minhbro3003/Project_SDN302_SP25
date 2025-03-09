import axios from "axios";

export const getAllRoom = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms`,
        data

    );
    console.log("res getAllRoom:", res);
    return res.data;
};

export const getHotelById = async (id) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms/${id}`

    );
    console.log("res getHotelById:", res);
    return res.data;
};

export const updateHotel = async (id, access_token, data) => {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms/${id}`,
        data,
        // {
        //     headers: {
        //         token: `Bearer: ${access_token}`,
        //     },
        // }
    );
    console.log("res updateHotel:", res);
    return res.data;
};

export const deleteHotel = async (id, access_token) => {
    const res = await axios.delete(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms/${id}`,
        // {
        //     headers: {
        //         token: `Bearer: ${access_token}`,
        //     },
        // }
    );
    console.log("res deleteHotel:", res);
    return res.data;
};

export const deleteManyProduct = async (iddata, access_token) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/product/delete-many-product`,
        iddata,
        {
            headers: {
                token: `Bearer: ${access_token}`,
            },
        }
    );
    return res.data;
};

export const getAllRoomTyoe = async () => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms-type`
    );
    console.log("res getAllRoomTyoe:", res);
    return res.data;
};

export const getAllRoomAmenities = async () => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rooms-amenities`
    );
    console.log("res getAllRoomAmenities:", res);
    return res.data;
};


export const getAvailableRooms = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/rooms/getavail`);
        return response.data; // Return the available rooms data
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        return { status: "ERR", message: error.response?.data?.message || "Failed to fetch available rooms" };
    }
};

export const checkRoomAvailability = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/rooms/getavail_`, {
            params: {
                startDate,
                endDate
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error checking room availability:", error);
        return { status: "ERR", message: error.response?.data?.message || "Failed to check room availability" };
    }
};

import axios from "axios";
export const axiosJWT = axios.create();


export const loginAccount = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/account/login`,
        data
    );

    return res.data;

};



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
export const createProduct = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/account/create`,
        data
    );
    return res.data;
};


export const getDetailsAccount = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/account/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};


export const refreshToken = async (refreshToken) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/account/refresh-token`,
        {},
        {
            headers: {
                token: `Bearer ${refreshToken}`,
            },
        }
    );
    return res.data;
};

export const getEmployeeByAccountId = async (id, access_token) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/employee/account/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching employee details:", error);
        return null;
    }
};

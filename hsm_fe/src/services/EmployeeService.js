import axios from "axios";


export const getAllEmployeeType = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/employee-type/get-all-employeeType`,
        data

    );
    console.log("data", data);
    return res.data;
};

export const getAllPermission = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/employee-type/get-all-permission`,
        data

    );
    console.log("data", data);
    return res.data;
};

export const getAllWorkingShift = async (data) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/employee-type/get-all-working_shift`,
        data

    );
    console.log("data", data);
    return res.data;
};

export const createEmployee = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/employee/create-employee`,
            data
        );
        return res.data;
    } catch (error) {
        return { status: "ERR", message: error.response?.data?.message };
    }
};
const Customer= require("../models/CustomerModel");
const createCustomer = (newCustomer) => {
    return new Promise(async (resolve, reject) => {
        const { full_name, phone, cccd} = newCustomer;
        try {

            const newCustomer = await Customer.create({
                full_name,
                phone,
                cccd,
            });

            resolve({
                status: "OK",
                message: "Success",
                data: newCustomer,
            });
        } catch (e) {
            reject({
                status: "error",
                message: e.message || "Internal server error",
                code: 500
            });
        }
    });
};



module.exports = {
    createCustomer,
};
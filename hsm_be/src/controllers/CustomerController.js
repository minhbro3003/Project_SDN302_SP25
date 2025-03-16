const CustomerService = require("../services/CustomerService");

const createCustomer = async (req, res) => {
    try {
        const {
            full_name,
                phone,
                cccd,
        } = req.body;
        
        const customer = await CustomerService.createCustomer(req.body);
        return res.status(200).json(customer);
    } catch (e) {
        return res.status(404).json({
            message: "Customer creation failed",
            error: e.message,
        });
    }
};


module.exports = {
    createCustomer,
};
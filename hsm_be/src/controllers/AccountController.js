const AccountService = require("../services/AccountService");

const createAcount = async (req, res) => {
    try {
        // console.log(req.body);
        const { FullName, Email, Username, Password } = req.body;
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isCheckEmail = mailformat.test(Email);
        if (!Email || !Password || !Username) {
            return res
                .status(200)
                .json({ status: "ERR", message: "The input is required." });
        } else if (!isCheckEmail) {
            return res
                .status(200)
                .json({ status: "ERR", message: "The input is email." });
        }

        console.log("isCheckEmail", isCheckEmail);
        const account = await AccountService.createAcount(req.body);
        return res.status(200).json(account);
    } catch (e) {
        return res.status(404).json({
            message: "User creation failed",
            error: e.message,
        });
    }
};

module.exports = {createAcount}
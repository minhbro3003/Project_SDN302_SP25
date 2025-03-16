const AccountService = require("../services/AccountService");
const { refreshTokenJwtService } = require("../services/JwtService");

const createAcount = async (req, res) => {
    try {
        // console.log(req.body);
        const { FullName, Email, Username, Password, permissions } = req.body;
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isCheckEmail = mailformat.test(Email);
        if (!Email || !Password || !Username || !permissions) {
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


const loginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email format validation
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !password) {
            return res.status(400).json({
                status: "ERR",
                message: "Email or password are required.",
            });
        }
        if (!mailformat.test(email)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid email format.",
            });
        }

        // Authenticate account
        const account = await AccountService.loginAccount(req.body);
        if (account.status === "ERR") {
            return res.status(401).json(account);
        }

        // Destructure refresh_token safely
        const { refresh_token, ...accountData } = account;

        // Set refresh token as HTTP-only cookie
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
        });

        return res.status(200).json({ ...accountData, refresh_token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            status: "ERR",
            message: "Account login failed",
            error: error.message,
        });
    }
};

const updateAccount = async (req, res) => {
    try {
        const accountId = req.params.id;
        const data = req.body;

        if (!accountId) {
            return res.status(400).json({
                status: "ERR",
                message: "The accountId is required",
            });
        }

        console.log("accountId:", accountId);

        const updatedAccount = await AccountService.updateAccount(accountId, data);

        if (!updatedAccount) {
            return res.status(404).json({
                status: "ERR",
                message: "Account not found or update failed",
            });
        }

        return res.status(200).json({
            status: "OK",
            message: "Account updated successfully",
            data: updatedAccount,
        });
    } catch (error) {
        console.error("Error updating account:", error);
        return res.status(500).json({
            status: "ERR",
            message: "An error occurred while updating the account",
            error: error.message,
        });
    }
};



const getAllAccounts = async (req, res) => {
    try {
        const accounts = await AccountService.getAllAccounts();
        return res.status(200).json(accounts);
    } catch (e) {
        return res.status(404).json({
            error: e.message,
        });
    }
};


const getDetailsAccount = async (req, res) => {
    try {
        const accountId = req.params.id;

        if (!accountId) {
            return res.status(400).json({
                status: "ERR",
                message: "The userId is required",
            });
        }

        const accountResponse = await AccountService.getDetailsAccount(accountId);

        // Nếu không tìm thấy user
        if (accountResponse.status === "ERR") {
            return res.status(404).json(accountResponse);
        }

        // Trả về kết quả thành công
        return res.status(200).json(accountResponse);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: "Server error occurred",
            error: e.message,
        });
    }
};

const refreshToken = async (req, res) => {
    // console.log("req.cookies.refresh_token: ", req.cookies.refresh_token);
    try {
        // const token = req.cookies.refresh_token;
        const token = req.headers.token.split(" ")[1];

        if (!token) {
            return res.status(200).json({
                status: "ERR",
                message: "The token is required",
            });
        }
        const account = await refreshTokenJwtService(token);

        return res.status(200).json(account);
    } catch (e) {
        return res.status(404).json({
            message: "! User creation failed 'SOS'!",
            error: e.message,
        });
    }
};


module.exports = { createAcount, getAllAccounts, getDetailsAccount, loginAccount, refreshToken }
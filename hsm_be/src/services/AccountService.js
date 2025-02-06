const Account = require("../models/AccountModel");
const bcrypt = require("bcryptjs");

const createAcount = (newAccount) => {
    return new Promise(async (resolve, reject) => {
        const { FullName, Email, Username, Password } = newAccount;
        try {
            const checkUser = await Account.findOne({
                Email: Email,
            });
            if (checkUser !== null) {
                return resolve({
                    status: "ERR",
                    message: "The email is already",
                });
            }
            const hash = bcrypt.hashSync(Password, 10);
            // console.log("hash:", hash);
            const createdAccount = await Account.create({
                FullName,
                Email,
                Username,
                Password: hash,
            });
            if (createdAccount) {
                resolve({
                    status: "OK",
                    message: "Account created successfully!",
                    data: createdAccount,
                });
            }
            console.log("Created Account:", createdAccount);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { createAcount };

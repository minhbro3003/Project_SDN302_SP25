const express = require("express");
const router = express.Router();
const accountController = require("../controllers/AccountController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", accountController.createAcount);
router.get("", accountController.getAllAccounts);
router.get("/:id", accountController.getDetailsAccount);
router.post("/login", accountController.loginAccount);

router.post("/refresh-token", accountController.refreshToken);

module.exports = router;

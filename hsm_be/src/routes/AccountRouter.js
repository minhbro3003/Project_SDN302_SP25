const express = require("express");
const router = express.Router();
const accountController = require("../controllers/AccountController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", accountController.createAcount);

module.exports = router;

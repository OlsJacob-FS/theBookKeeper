const express = require("express");
const {saveUser, verifyToken} = require("../controllers/authController");
// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/verify", verifyToken, saveUser);

module.exports = router;

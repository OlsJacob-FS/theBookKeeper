const {
  updateProfile,
  getProfile,
} = require("../controllers/profileController");
const {verifyToken} = require("../controllers/authController");
// eslint-disable-next-line new-cap
const router = require("express").Router();

router.post("/updateProfile", verifyToken, updateProfile);
router.get("/getProfile", verifyToken, getProfile);

module.exports = router;

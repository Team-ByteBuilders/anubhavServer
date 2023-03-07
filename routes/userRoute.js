const router = require("express").Router();
const {
  userDetails,
  personalDetails,
  getUser,
  getUserDetail,
  emergencybutton,
  addDailyDetail
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authToken");

router.post("/userdetails",authenticateToken, userDetails);
router.post("/personaldetails", authenticateToken, personalDetails);
router.post("/getnearbyuser", authenticateToken, getUser);
router.post("/getuserdetail", authenticateToken, getUserDetail);
router.post("/emergencybutton", authenticateToken, emergencybutton);
router.post("/adddailydetail", authenticateToken, addDailyDetail);
module.exports = router;

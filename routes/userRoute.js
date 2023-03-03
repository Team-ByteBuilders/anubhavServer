const router = require("express").Router();
const {
	userDetails,
	personalDetails,
	getUser
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authToken");

router.post("/userdetails",authenticateToken, userDetails);
router.post("/personaldetails", authenticateToken, personalDetails);
router.post("/getnearbyuser", authenticateToken, getUser);
module.exports = router;

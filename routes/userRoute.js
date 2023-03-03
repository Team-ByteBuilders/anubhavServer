const router = require("express").Router();
const {
	userDetails,
	personalDetails
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authToken");

router.post("/userdetails",authenticateToken, userDetails);
router.post("/personaldetails", authenticateToken, personalDetails);
module.exports = router;

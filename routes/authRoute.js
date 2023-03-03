const router = require("express").Router();
const {
	login,
	register,
	resetPassword,
	userDetails,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authToken");

router.post("/register", register);
router.post("/login", login);
router.put("/resetPassword", resetPassword);

module.exports = router;

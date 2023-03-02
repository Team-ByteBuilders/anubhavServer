const { db } = require("../db");
//Register
const register = async (req, res) => {
	// register code here

	db.query("select * from users", function (err, result) {
		if (err) console.log(err);
		console.log(result);
	});
};

//login
const login = async (req, res) => {
	// login code here
};

const resetPassword = async (req, res) => {
	// reset pass
};

module.exports = {
	register,
	login,
	resetPassword,
};

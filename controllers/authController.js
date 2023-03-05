const { db } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register
const register = async (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		const email = req.body.email;
		const salt = await bcrypt.genSalt(10);
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) {
				res.status(500).send(err);
			}
			db.query(
				`INSERT INTO users (email, name,password) VALUES (?,?,?)`,
				[email, username, hash],
				function (err, result) {
					if (err) {
						res.status(400).send({
							message: "Already registered !!",
						});
					}
					else
					{
						res.status(200).send({
							message: "registered successfully:)",
						});
					}
					
				}
			);
		});
	} catch (err) {
		res.status(500).send(err);
	}
};

//login
const login = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		db.query(`SELECT * FROM users where email= ? `, email, (err, result) => {
			if (result.length > 0) {
				bcrypt.compare(password, result[0].password, (err, response) => {
					if (!response) {
						res
							.status(401)
							.send({ message: "wrong combination of username and password" });
					} else {
						const email = result[0].email;
						const token = jwt.sign({ email }, "jwtsectret");
						res.status(200).json({ token: token });
					}
				});
			} else if (result == 0) {
				res.status(404).send({ message: "user does not exist!!" });
			} else if (err) {
				res.status(500).send(err);
			}
		});
	} catch (err) {
		res.status(500).send(err);
	}
};

const resetPassword = async (req, res) => {
	// reset pass
};

module.exports = {
	register,
	login,
	resetPassword,
};

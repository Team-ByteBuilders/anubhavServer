const { db } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register
const register = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const dob = req.body.dob;
	const salt = await bcrypt.genSalt(10);
	bcrypt.hash(password, salt, (err, hash) => {
		if (err) {
			console.log(err);
		}
		db.query(
			`INSERT INTO users (email, name,password,dob) VALUES (?,?,?,?)`,
			[email, username, hash, dob],
			function (err, result) {
				if (err) {
					res.status(400).send(err);
				}
				res.status(200).send("registered successfully:)");
			}
		);
	});
};

//login
const login = async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	db.query(`SELECT * FROM users where email= ? `, email, (err, result) => {
		if (result.length > 0) {
			bcrypt.compare(password, result[0].password, (err, response) => {
				console.log(response);
				if (!response) {
					res.send({ message: "wrong combination of username and password" });
				} else {
					const email = result[0].email;
					const token = jwt.sign({ email }, "jwtsectret");
					res.json({ token: token });
				}
			});
		} else if (result == 0) {
			res.send({ message: "user does not exist!!" });
		} else if (err) {
			//  res.send({message:"enter correct asked detail"})
			res.send(err);
		}
	});
};

const userDetails = async (req, res) => {
	const altPhnNo = req.body.altPhnNo;
	const modeOfContact = req.body.modeOfContact;

	console.log(altPhnNo, modeOfContact);
	res = await db
		.request()
		.query(
			`INSERT INTO userdetails (altPhnNo,modeOfContact) VALUES(?,?) where email=?`,
			[altPhnNo, modeOfContact, req.email],
			(err, result) => {
				console.log(err);
				res.send(err);
			}
		);
	res.send("success");
};

const resetPassword = async (req, res) => {
	// reset pass
};

module.exports = {
	register,
	login,
	resetPassword,
	userDetails,
};

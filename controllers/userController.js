const { mysql_pool } = require("../db");
require("dotenv").config();
// const date = require('date-and-time')
const userDetails = async (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			console.log(" Error getting mysql_pool connection: " + err);
			res.status(500).send({ message: "try again" });
			return;
		}
		try {
			const altPhnNo = req.body.altPhnNo;
			const blood = req.body.bloodgroup;
			const sugar = req.body.sugar;
			const heartrate = req.body.heartrate;
			const pulse = req.body.pulse;
			const blood_pressure = req.body.blood_pressure;
			connection.query(
				`update users set alternatePhone = ?, blood_group = ?, sugar_level= ?, heartrate=?, pulse=?,blood_pressure=?  where email=?`,
				[
					altPhnNo,
					blood,
					sugar,
					heartrate,
					pulse,
					blood_pressure,
					req.email.email,
				],
				(err, result) => {
					if (result) {
						res.status(200).send({ message: "success" });
						return;
					} else {
						res.status(500).send(err);
						return;
					}
				}
			);
		} catch (err) {
			res.status(500).send(err);
			return;
		}
		connection.release();
	});
};
const personalDetails = async (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			console.log(" Error getting mysql_pool connection: " + err);
			res.status(500).send({ message: "try again" });
			return;
		}
		try {
			const dob = req.body.dob;
			const gender = req.body.gender;
			const mobile = req.body.mobile;
			const lat = req.body.lat;
			const lon = req.body.lon;
			connection.query(
				`update users set dob = ?, gender = ?, mobile = ?, lat =? , lon=? where email=?`,
				[dob, gender, mobile, lat, lon, req.email.email],
				(err, result) => {
					if (result) {
						res.status(200).send({ message: "success" });
						return;
					} else {
						res.status(500).send(err);
						return;
					}
				}
			);
		} catch (err) {
			res.status(500).send(err);
			return;
		}
		connection.release();
	});
};

const getUser = async (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			console.log(" Error getting mysql_pool connection: " + err);
			res.status(500).send({ message: "try again" });
			return;
		}
		try {
			const nearsetUser = [];
			function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
				var R = 6371; // Radius of the earth in km
				var dLat = deg2rad(lat2 - lat1); // deg2rad below
				var dLon = deg2rad(lon2 - lon1);
				var a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(deg2rad(lat1)) *
					Math.cos(deg2rad(lat2)) *
					Math.sin(dLon / 2) *
					Math.sin(dLon / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				var d = R * c; // Distance in km
				return d;
			}

			function deg2rad(deg) {
				return deg * (Math.PI / 180);
			}

			connection.query(
				`SELECT lat,lon from users WHERE email=?`,
				[req.email.email],

				(err, result1) => {
					if (result1) {
						connection.query(
							`SELECT name,email,dob,mobile,gender,alternatePhone,lastActive,lat,lon FROM users WHERE NOT email=?`,
							[req.email.email],
							(err, result2) => {
								if (result2) {
									for (var i = 0; i < result2.length; i++) {
										if (
											getDistanceFromLatLonInKm(
												result1[0].lat,
												result1[0].lon,
												result2[i].lat,
												result2[i].lon
											) <= 5
										) {
											nearsetUser.push(result2[i]);
										}
									}
									res.status(200).send(nearsetUser);
									return;
								} else {
									res.status(500).send(err);
									return;
								}
							}
						);
					} else {
						res.status(500).send(err);
						return;
					}
				}
			);
		} catch (err) {
			res.status(500).send(err);
			return;
		}
		connection.release();
	});
};

const getUserDetail = async (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			console.log(" Error getting mysql_pool connection: " + err);
			res.status(500).send({ message: "try again" });
			return;
		}
		var start = new Date().toISOString();
		console.log(start.toString());
		connection.query(
			`UPDATE users SET lastActive=? WHERE email=?`,
			[start, req.email.email],
			(err, result) => {
				if (result)
					connection.query(
						`SELECT name,email,dob,mobile,gender,alternatePhone,lastActive from users WHERE email=?`,
						[req.email.email],
						(error, result1) => {
							if (result1) res.status(200).send(result1);
							else res.status(401).send(error);
						}
					);
				else res.status(401).send(err);
			}
		);
		connection.release();
	});
};

const addDailyDetail = async (req, res) => {
	// mysql_pool.getConnection(function (err, connection) {
	// 	if (err) {
	// 		console.log(" Error getting mysql_pool connection: " + err);
	// 		res.status(500).send({ message: "try again" });
	// 		return;
	// 	}
	// 	// var start = new Date();
	// 	// Date.parse(start).toString("dd-MM-yyyy")
	// 	const value = date.format((new Date()),
	// 		'YYYY_MM_DD');
	// 	// console.log(start);
	// 	var queryy = `ALTER TABLE bp ADD COLUMN ${value} VARCHAR(255)`
	// 	connection.query(queryy, (err, result) => {
	// 		if (result) {
	// 			res.send({ message: "result" })
	// 		}
	// 		else {
	// 			console.log(err);
	// 		}
	// 	});
	// 	connection.release();
	// });
	res.send({ message: "hello" })
};

const emergencybutton = (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			console.log(" Error getting mysql_pool connection: " + err);
			res.status(500).send({ message: "try again" });
			return;
		}
		const lat = req.body.lat;
		const lon = req.body.lon;
		connection.query(
			`select alternatePhone from users where email=?`,
			[req.email.email],
			(err, result) => {
				if (result) {
					const accountSid = process.env.TWILIO_ACCOUNT_SID;
					const authToken = process.env.TWILIO_AUTH_TOKEN;
					const client = require("twilio")(accountSid, authToken);

					client.calls
						.create({
							to: `+91${result[0].alternatePhone}`,
							from: "+12706752706",
							url: "https://handler.twilio.com/twiml/EH5209e0a1e47fba113d407cb50aa124c8",
						})
						.then((call) => {
							console.log(call.sid)

						});

					if (!lat || !lon) {
						res.status(400).send({ message: "no lat lon recieved" });
						return;
					}
					connection.query(`select * from hospital`, (err, result) => {
						let arr = [];
						if (result) {
							function deg2rad(deg) {
								return deg * (Math.PI / 180);
							}
							function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
								var R = 6371; // Radius of the earth in km
								var dLat = deg2rad(lat2 - lat1); // deg2rad below
								var dLon = deg2rad(lon2 - lon1);
								var a =
									Math.sin(dLat / 2) * Math.sin(dLat / 2) +
									Math.cos(deg2rad(lat1)) *
									Math.cos(deg2rad(lat2)) *
									Math.sin(dLon / 2) *
									Math.sin(dLon / 2);
								var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
								var d = R * c; // Distance in km
								return d;
							}
							for (let i = 0; i < result.length; i++) {
								if (
									getDistanceFromLatLonInKm(
										result[i].lat,
										result[i].lon,
										lat,
										lon
									) <= 6
								) {
									arr.push(result[i]);
								}
							}
							for (var i = 0; i < arr.length; i++) {

								client.calls
									.create({
										to: `+91${arr[i].phone_no}`,
										from: "+12706752706",
										url: "https://handler.twilio.com/twiml/EH437ac1a2891f0e0745bead79c358bb1c",
									})
									.then((call) => {
										console.log(call.sid)
									});
							}
							res.status(200).send({message:"calling homies and hospitals..."})
							return;
						} else {
							res.status(500).send(err);
							return;
						}
					});
				} else if (err) {
					console.log(err);
					res.status(300).send(err);
					return;
				}
			}
		);
		connection.release();
	});
};

module.exports = {
	userDetails,
	personalDetails,
	getUser,
	getUserDetail,
	emergencybutton,
	addDailyDetail,
};

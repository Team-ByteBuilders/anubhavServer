const { mysql_pool } = require("../db");
require("dotenv").config();
const userDetails = async (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			console.log(" Error getting mysql_pool connection: " + err);
		}
		try {
			const altPhnNo = req.body.altPhnNo;
			const blood = req.body.bloodgroup;
			const sugar = req.body.sugar;
			const heartrate = req.body.heartrate;
			connection.query(
				`update users set alternatePhone = ?, blood_group = ?,sugar_level= ?,heartrate=?  where email=?`,
				[altPhnNo, blood, sugar, heartrate, req.email.email],
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
			connection.release();
			console.log(" Error getting mysql_pool connection: " + err);
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
			connection.release();
			console.log(" Error getting mysql_pool connection: " + err);
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
							`SELECT * FROM users WHERE NOT email=?`,
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
			connection.release();
			console.log(" Error getting mysql_pool connection: " + err);
		}
		var start = new Date();
		console.log(start.toString());
		connection.query(
			`UPDATE users SET lastActive=? WHERE email=?`,
			[start, req.email.email],
			(err, result) => {
				if (result)
					connection.query(
						`SELECT * from users WHERE email=?`,
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
const emergencybutton = (req, res) => {
	mysql_pool.getConnection(function (err, connection) {
		if (err) {
			connection.release();
			console.log(" Error getting mysql_pool connection: " + err);
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
							to: `${result[0].alternatePhone}`,
							from: "+12706752706",
							url: "https://handler.twilio.com/twiml/EH54ca708211f610b3797fe0a6ae234fa7",
						})
						.then((call) => console.log(call.sid));

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
								console.log(arr[i]);
							}
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
};

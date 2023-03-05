const { db } = require("../db");

const userDetails = async (req, res) => {
	try {
		const altPhnNo = req.body.altPhnNo;
		const blood = req.body.bloodgroup;
		const sugar = req.body.sugar;
		const heartrate = req.body.heartrate;
		db.query(
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
};
const personalDetails = async (req, res) => {
	try {
		const dob = req.body.dob;
		const gender = req.body.gender;
		const mobile = req.body.mobile;
		const lat = req.body.lat;
		const lon = req.body.lon;
		db.query(
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
};

const getUser = async (req, res) => {
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

		db.query(
			`SELECT lat,lon from users WHERE email=?`,
			[req.email.email],

			(err, result1) => {
				if (result1) {
					db.query(
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
};

module.exports = {
	userDetails,
	personalDetails,
	getUser,
};

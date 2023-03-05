const { db } = require("../db");

const getHopitals = async (req, res) => {
	try {
		const lat = req.body.lat;
		const lon = req.body.lon;
		if (!lat || !lon) {
			res.status(400).send({ message: "no lat lon recieved" });
			return;
		}
		db.query(`select * from hospital`, (err, result) => {
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
						getDistanceFromLatLonInKm(result[i].lat, result[i].lon, lat, lon) <=
						6
					) {
						arr.push(result[i]);
					}
				}
				res.status(200).send(arr);
				return;
			} else {
				res.status(500).send(err);
				return;
			}
		});
	} catch (err) {
		res.status(500).send(err);
		return;
	}
};
module.exports = { getHopitals };

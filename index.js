const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { mysql_pool } = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const hospitalRoute = require("./routes/hospitalRoute");
const { db } = require("./db");
const date = require('date-and-time');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors("http://localhost:3000"));

// routes
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/hospital", hospitalRoute);

app.listen(PORT, () => {
	console.log(`server listening on ${PORT} 🎉🎉`);
});

const checktime = () => {
	var hours = new Date().getUTCHours();
	var min = new Date().getUTCMinutes();
	var sec = new Date().getUTCSeconds();
	// console.log(hours,min,sec)

	if (hours == 6 && min == 30 && sec == 0) {
		mysql_pool.getConnection(function (err, connection) {
			if (err) {
				console.log(" Error getting mysql_pool connection: " + err);
			}
			else {
				try {
					connection.query(
						`SELECT name,mobile,lastActive,alternatePhone FROM users`,
						(err, result) => {
							console.log("hell");
							console.log(result);
							if (result) {
								console.log(result)
								for (let i = 0; i < result.length; i++) {

									const asdf = result[i].lastActive;
									if (asdf != null) {
										const a = asdf.slice(11, 13);
										const b = parseInt(a);
										console.log(b);
										if (b <= 1) {
											const accountSid = process.env.TWILIO_ACCOUNT_SID;
											const authToken = process.env.TWILIO_AUTH_TOKEN;
											const client = require("twilio")(accountSid, authToken);

											client.calls
												.create({
													to: `+91${result[i].alternatePhone}`,
													from: "+12706752706",
													url: "https://handler.twilio.com/twiml/EH54ca708211f610b3797fe0a6ae234fa7",
												})
												.then((call) => console.log(call.sid));

											console.log("code");
										}
										else{
											console.log("error nhi aaya")
										}
									}
								}
							} else {
								console.log(err);
							}
						}
					);
				} catch (error) {
					console.log(error);
				}
			}
			connection.release();
		});
	}
	if (hours == 18 && min == 35 && sec == 0) {

		console.log("chli ya nhi btaooo")
		mysql_pool.getConnection(async function (err, connection) {
			if (err) {
				console.log(" Error getting mysql_pool connection: " + err);
				return;
			}
			const value = date.format((new Date()),
				'YYYY_MM_DD');
			var queryy1 = `ALTER TABLE bp ADD COLUMN ${value} VARCHAR(255)`
			var queryy2 = `ALTER TABLE heartrate ADD COLUMN ${value} VARCHAR(255)`
			var queryy3 = `ALTER TABLE pulse ADD COLUMN ${value} VARCHAR(255)`
			var queryy4 = `ALTER TABLE sugar ADD COLUMN ${value} VARCHAR(255)`
			// var queryy1 = `SELECT NULL FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME="bp" AND COLUMN_NAME=${value}`
			// connection.query(queryy5,)
			connection.query(queryy1, (err, result) => {
				if (result) {
					console.log(result)
					// connection.release();
				}
				else {
					// console.log(err);
					// connection.release();
				}

			});
			connection.query(queryy2, (err, result) => {
				if (result) {
					console.log(result)
					// connection.release();
				}
				else {
					// console.log(err);
					// connection.release();
				}
			});

			connection.query(queryy3, (err, result) => {
				if (result) {
					console.log(result)

				}
				else {
					// console.log(err);

				}
			});
			connection.query(queryy4, (err, result) => {
				if (result) {
					console.log(result)

				}
				else {
					// console.log(err);

				}
			});
			connection.release()
		});
	}
};

// const addDailyDate = () => {
// 	console.log("chli ya nhi btaooo")
// 	mysql_pool.getConnection(async function (err, connection) {
// 		if (err) {
// 			console.log(" Error getting mysql_pool connection: " + err);
// 			return;
// 		}
// 		const value = date.format((new Date()),
// 			'YYYY_MM_DD');
// 		var queryy1 = `ALTER TABLE bp ADD COLUMN ${value} VARCHAR(255)`
// 		var queryy2 = `ALTER TABLE heartrate ADD COLUMN ${value} VARCHAR(255)`
// 		var queryy3 = `ALTER TABLE pulse ADD COLUMN ${value} VARCHAR(255)`
// 		var queryy4 = `ALTER TABLE sugar ADD COLUMN ${value} VARCHAR(255)`
// 		// var queryy1 = `SELECT NULL FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME="bp" AND COLUMN_NAME=${value}`
// 		// connection.query(queryy5,)
// 		connection.query(queryy1, (err, result) => {
// 			if (result) {
// 				console.log(result)
// 				// connection.release();
// 			}
// 			else {
// 				// console.log(err);
// 				// connection.release();
// 			}

// 		});
// 		connection.query(queryy2, (err, result) => {
// 			if (result) {
// 				console.log(result)
// 				// connection.release();
// 			}
// 			else {
// 				// console.log(err);
// 				// connection.release();
// 			}
// 		});

// 		connection.query(queryy3, (err, result) => {
// 			if (result) {
// 				console.log(result)

// 			}
// 			else {
// 				// console.log(err);

// 			}
// 		});
// 		connection.query(queryy4, (err, result) => {
// 			if (result) {
// 				console.log(result)

// 			}
// 			else {
// 				// console.log(err);

// 			}
// 		});
// 		connection.release()

// 	});
// }

setInterval(() => {
	checktime();
}, 1000);

// setInterval(() => {
// 	addDailyDate();
// }, 3000);

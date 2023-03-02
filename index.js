const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const authRoute = require("./routes/authRoute");
const jwt =require("jsonwebtoken")

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//sql connection
const db = mysql.createConnection({
	host: "sql12.freesqldatabase.com",
	user: "sql12602314",
	password: "w5UKWc1Zpt",
	database: "sql12602314",
	port: 3306,
});
db.connect(function (err) {
	if (err) throw err;
	console.log("Connected to database :)");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors("http://localhost:3000"));

// routes
app.use("/auth", authRoute);

app.listen(PORT, () => {
	console.log(`server listening on ${PORT} 🎉🎉`);
	console.log("connecting to db...");
});

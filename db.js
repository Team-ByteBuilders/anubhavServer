const mysql = require("mysql");

//sql connection
var db;

const kuxBiKrkeConnect = () => {
	db = mysql.createConnection({
		host: "sql12.freesqldatabase.com",
		user: "sql12602314",
		password: "w5UKWc1Zpt",
		database: "sql12602314",
		port: 3306,
	});
	db.connect(function (err) {
		if (err) {
			setTimeout(() => {
				console.log(err.sqlMessage);
				console.log("error occured but kux bi krke connecting...");
				kuxBiKrkeConnect();
			}, 1000);
		} else {
			console.log("Connected to database :)");
		}
	});
};

kuxBiKrkeConnect();

const query = async (sql) => {
	db.query(sql, function (err, result) {
		if (err) return err;
		return result;
	});
};

module.exports = {
	db,
	query,
};

const mysql = require("mysql");

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

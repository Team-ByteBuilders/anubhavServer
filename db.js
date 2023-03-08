const mysql = require("mysql");

//sql connection
// var db;

// const kuxBiKrkeConnect = () => {
// 	db = mysql.createConnection({
// 		host: "sql12.freesqldatabase.com",
// 		user: "sql12602314",
// 		password: "w5UKWc1Zpt",
// 		database: "sql12602314",
// 		port: 3306,
// 	});
// 	db.connect(function (err) {
// 		if (err) {
// 			setTimeout(() => {
// 				db.destroy();
// 				console.log(err.sqlMessage);
// 				console.log("error occured but kux bi krke connecting...");
// 				kuxBiKrkeConnect();
// 			}, 1000);
// 		} else {
// 			console.log("Connected to database :)");
// 		}
// 	});
// };

var mysql_pool = mysql.createPool({
	connectionLimit: 100,
	connectTimeout:60*60*1000,
	acquireTimeout:60*60*1000,
	timeout:60*60*1000,
	host: "sql12.freesqldatabase.com",
	user: "sql12602314",
	password: "w5UKWc1Zpt",
	database: "sql12602314",
	port: 3306,
});

// kuxBiKrkeConnect();

module.exports = {
	mysql_pool,
};

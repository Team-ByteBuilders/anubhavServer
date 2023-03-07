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
  var hours = new Date().getHours();
  var min = new Date().getMinutes();
  var sec = new Date().getSeconds();
  mysql_pool.getConnection(function (err, connection) {
    if (err) {
      console.log(" Error getting mysql_pool connection: " + err);
      res.status(500).send({ message: "try again" });
      return;
    }
    try {
      if (hours == 23 && min == 19 && sec == 0) {
        connection.query(
          `SELECT name,mobile,lastActive FROM users`,
          (err, result) => {
            console.log("hell");
            console.log(result);
            if (result) {
              console.log(result)

        
            for(let i=0;i<result.length;i++){
				
				const asdf = result[i].lastActive;
				if(asdf!=null){
					
					const a=asdf.slice(11,13);
		            
					console.log(a);
				}
			}
              
            } else {
              console.log(err);
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    connection.release();
  });
};

setInterval(() => {
  checktime();
}, 1000);

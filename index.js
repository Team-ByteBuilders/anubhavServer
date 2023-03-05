const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
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
  console.log("connecting to db...");
});


const checktime = () => {
  var hours = new Date().getHours();
  var min = new Date().getMinutes();
  var sec = new Date().getSeconds();
  if (hours == 12 && min == 0 && sec == 0) {
    
    require("dotenv").config();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    client.calls
      .create({
        to: "+918770800031",
        from: "+12706752706",
        url: "https://handler.twilio.com/twiml/EH54ca708211f610b3797fe0a6ae234fa7",
      })
      .then((call) => console.log(call.sid));

    console.log("code")
  }
}

setInterval(() => {
  checktime();
}, 1000);



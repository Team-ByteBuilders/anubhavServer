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

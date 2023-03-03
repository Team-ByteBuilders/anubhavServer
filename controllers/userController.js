const { db } = require("../db");

const userDetails = async (req, res) => {
  const altPhnNo = req.body.altPhnNo;
  const blood = req.body.bloodgroup;
  const sugar = req.body.sugar;
  const heartrate = req.body.heartrate;
  console.log(altPhnNo, blood, sugar, heartrate, req.email);
  db.query(
    `update users set alternatePhone = ?, blood_group = ?,sugar_level= ?,heartrate=?  where email=?`,
    [altPhnNo, blood, sugar, heartrate, req.email.email],
    (err, result) => {
    if (result) {
        res.send("success");
    } else {
        console.log(err);
        res.send(err);
    }
    }
  );
};
const personalDetails = async (req, res) => {
  const dob = req.body.dob;
  const gender = req.body.gender;
  const mobile = req.body.mobile;
  const lat = req.body.lat;
  const lon = req.body.lon;
  console.log(dob,gender,mobile,lat,lon, req.email);
  db.query(
    `update users set dob = ?, gender = ?, mobile = ?, lat =? , lon=? where email=?`,
    [dob, gender, mobile, lat, lon, req.email.email],
    (err, result) => {
      if (result) {
        res.send("success");
      } else {
        console.log(err);
        res.send(err);
      }
    }
  );
};
module.exports = { userDetails,
                   personalDetails };

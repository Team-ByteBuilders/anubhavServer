const router = require("express").Router();
const { getHopitals } = require("../controllers/hopitalController");
const authenticateToken = require("../middleware/authToken");

router.post("/gethospitals", authenticateToken, getHopitals);
module.exports =  router ;

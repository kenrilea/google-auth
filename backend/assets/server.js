const express = require("express");
const cors = require("cors");
const multer = require("multer");

const cookieParser = require("cookie-parser");
const app = express();

const fs = require("fs");

const upload = multer({ dest: __dirname + "/uploads/" }); // Set file upload destination

// app.listen(4000, () => {
//    // LOCAL SERVER
//    console.log("Running on port 4000");
// });

//_____________________MIDLEWARE_______________________
app.use(cors());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // CONFIG FOR LOCAL SERVER

app.use("/assets", express.static(__dirname + "/assets"));
//app.use(cors({ credentials: true, origin: "http://134.209.119.133:3000" })); // CONFIG FOR REMOTE SERVER

//________________SERVER TEMP DATA STORAGE__________________

const users = {};
const apiKey = "AIzaSyCjcMHu5LfOWsGVNAFWm9zC_NJsOJ4U0hw";
const clientId =
  "158270970601-g1fl65skt2li0e26vjb4lft03eknkghi.apps.googleusercontent.com";
//_________________Begining of END POINTS___________________

// endpoint "/" returns the login and calendar page

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/assets/calendar.html");
});
//_________________End of END POINTS____________________
app.listen(4000, "0.0.0.0", () => {
  // REMOTE SERVER/DROPLET
  console.log("Running on port 4000 , 0.0.0.0");
});

const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const app = express();
//_____________________MIDLEWARE_______________________
app.use(cors());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//create endpoints for all files in the /assets folder
app.use("/assets", express.static(__dirname + "/assets"));

//
//_________________Begining of END POINTS___________________

// endpoint "/" returns the main html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/assets/calendar.html");
});
//_________________End of END POINTS____________________
app.listen(4000, "0.0.0.0", () => {
  // REMOTE SERVER/DROPLET
  console.log("Running on port 4000 , 0.0.0.0");
});

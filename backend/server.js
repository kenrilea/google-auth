const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const app = express();

const multer = require("multer");
const upload = multer();
const MongoClient = require("mongodb").MongoClient;

//_____________________MOGODB Setup___________________
let dataBaseUrl =
  "mongodb+srv://kenton:_________@cluster0-qdmfh.mongodb.net/test?retryWrites=true&w=majority";

let projectDB;
let usersCollection;

(async function initDB() {
  await MongoClient.connect(
    dataBaseUrl,
    { useNewUrlParser: true },
    (err, allDbs) => {
      console.log(
        "-----------------------Database Initialised-----------------------"
      );
      // Add option useNewUrlParser to get rid of console warning message
      if (err) throw err;
      projectDB = allDbs.db("Sesami-google-login");
      usersCollection = projectDB.collection("users");
    }
  );
})();

//_____________________MIDLEWARE_______________________
app.use(cors());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:4000" }));

//create endpoints for all files in the /assets folder
app.use("/assets", express.static(__dirname + "/assets"));

//__________________UTILITIES______________________________

let parseObject = calendarString => {
  let calendarObj = {};
  let calendar = calendarString.split("$End_Object$");
  calendar.pop();
  console.log(calendar.length);
  calendar = calendar.forEach(elem => {
    elem = elem.split("$Object_Key$");
    let key = elem[0];
    let subObj = {};
    elem.shift();
    elem.forEach(keyValuePair => {
      keyValuePair = keyValuePair.split("$Object_Value$");
      subObj[keyValuePair[0]] = keyValuePair[1];
    });
    calendarObj[key] = subObj;
  });
  return calendarObj;
};
//_________________Begining of END POINTS___________________

// endpoint "/" returns the main html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/assets/calendar.html");
});

// endpoint "/calendar"
// loads the whole calendar that the client gets from the google api
app.post("/calendar", upload.none(), (req, res) => {
  console.log("calendar POST");
  let calendarObj = parseObject(req.body.calendar);
  console.log(calendarObj);
  usersCollection.find({ user: req.body.user }).toArray((err, result) => {
    if (result.length < 1) {
      usersCollection.insertOne(
        {
          user: req.body.user,
          calendar: calendarObj
        },
        (err, result) => {
          if (err) throw err;
          console.log("DB: added entry to the calendar collection");
        }
      );
      res.send("update request recieved");
      return;
    }
    let query = { user: req.body.user };
    let newValue = { $set: { calendar: calendarObj } };
    usersCollection.updateOne(query, newValue, (err, res) => {
      if (err) throw err;
      console.log(req.body.user + " calendar updated");
    });
  });
  res.send("update request recieved");
});

// endpoint "/event"
// handles event additions and event edits from the application.
app.post("/event", upload.none(), (req, res) => {
  const event = parseObject(req.body.event);
  const eventId = Object.keys(event)[0];
  console.log(event);
  const user = req.body.user;
  console.log("user " + user);
  usersCollection.find({ user: user }).toArray((err, result) => {
    if (result.length < 1) {
      res.send("user does not exist");
      res.send("update request recieved");
      return;
    }
    let updatedCalendar = result[0].calendar;
    updatedCalendar[eventId] = event[eventId];
    let query = { user };
    let newValue = { $set: { calendar: updatedCalendar } };
    usersCollection.updateOne(query, newValue, (err, res) => {
      if (err) throw err;
      console.log(req.body.user + " calendar updated event " + eventId);
    });
  });
  res.send("update request recieved");
});

//_________________End of END POINTS____________________
app.listen(4000, "0.0.0.0", () => {
  // REMOTE SERVER/DROPLET
  console.log("Running on port 4000 , 0.0.0.0");
});

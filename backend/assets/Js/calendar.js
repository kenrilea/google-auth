/*
TABLE OF CONTENTS
------------------------------------------------------------------------------------------------------
DECLARATIONS - declares CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES needed for google api connection
               and also some button element references that are used in update signin status
------------------------------------------------------------------------------------------------------
handleClientLoad - function - triggers the initiation of the client

initClient - function - initiates the client
------------------------------------------------------------------------------------------------------
updateSinginStatus - function - show and hide login/addEvent button when the user is||isnot logged in

handleAuthClick - function - when click on the login button, log in

revealForm - function - when +New button is clicked, reveal the inputs to add a new event
------------------------------------------------------------------------------------------------------
formatTime - utility function -  of appendEvent, reformats google formated time to be easily read by humans

appendEvent - function - creates DOM nodes for the new event and adds them to the new event container or
              the event container
------------------------------------------------------------------------------------------------------
listUpcomingEvents - function - gets events from google calendar API and calls appendEvent to add them to
                                the event container

handleAddEventClick - function - when the "Save" button in the +Event section is clicked, trigger the
                                 request to add a new event and add that event to the new event container
                                 once it has been added
------------------------------------------------------------------------------------------------------
*/

//____________________________________________________________________________________________
// DATA required to initiate the google connection
const CLIENT_ID =
  "158270970601-g1fl65skt2li0e26vjb4lft03eknkghi.apps.googleusercontent.com";
const API_KEY = "AIzaSyCjcMHu5LfOWsGVNAFWm9zC_NJsOJ4U0hw";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

const SCOPES = "https://www.googleapis.com/auth/calendar";
//____________________________________________________________________________________________

//login, logout, and add event button references set up
const authorizeButton = document.getElementById("authorize_button");
const addEventButton = document.getElementById("add_event_button");

//____________________________________________________________________________________________

// when the google client loads, init client
let handleClientLoad = () => {
  gapi.load("client:auth2", initClient);
};

// Initiates the client
let initClient = () => {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      () => {
        // listen for if there is a change to the signin status
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // sets up the handler for login button on click
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
      },
      error => {
        console.log(error);
      }
    );
};
//________________________________________________________________________________________________
// BUTTONS

// if user is logged in show log out button and hide log in button
let updateSigninStatus = isSignedIn => {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    addEventButton.style.display = "block";
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = "block";
    addEventButton.style.display = "none";
  }
};

//trigger by click on login button
let handleAuthClick = event => {
  gapi.auth2.getAuthInstance().signIn();
};

//triggered on click of the +New button, reveals the form to add a new event
let revealForm = () => {
  let FormContainer = document.getElementById("new_event_form_container");
  if (FormContainer.style.display === "block") {
    FormContainer.style.display = "none";
  } else {
    FormContainer.style.display = "block";
  }
};

//________________________________________________________________________________________________

// converts the time from the google format of yyyy-mm-ddT00:00:00-00:00
// to a more human readable format for the event element text
// utility for the appendEvent function
let formatTime = dateTime => {
  dateTime = dateTime.split("T");
  let dateString = dateTime[0];
  let timeString = dateTime[1];
  timeString = timeString.split("-")[0];

  return dateString + " @ " + timeString;
};

// adds events to the users screen
let appendEvent = (event, isNew) => {
  let eventContainer = document.getElementById("event_container");
  if (isNew === true) {
    eventContainer = document.getElementById("new_event_container");
  }
  let div = document.createElement("div");

  let heading = document.createElement("h3");
  let headingText = document.createTextNode(event.summary);
  heading.appendChild(headingText);
  let fromTo = document.createElement("p");
  let fromToText = document.createTextNode(
    "Start Time: " +
      formatTime(event.start.dateTime) +
      "  ||  End Time: " +
      formatTime(event.end.dateTime)
  );
  fromTo.appendChild(fromToText);
  let description = document.createElement("p");
  let descriptionText = document.createTextNode(event.description);
  description.appendChild(descriptionText);

  div.appendChild(heading);
  div.appendChild(fromTo);
  div.appendChild(description);

  eventContainer.appendChild(div);

  if (
    event.description !== undefined &&
    event.description.split("-").includes("event created by sesami") === true
  ) {
    div.className = "sesami_event_container";
    return;
  } else {
    div.className = "event_container";
    return;
  }
};
//------------------------------------------------------------------------------------------

// display events to the user
// 50 events total are displayed
let listUpcomingEvents = () => {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 50,
      orderBy: "startTime"
    })
    .then(response => {
      let events = response.result.items;
      console.log(response);
      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          let event = events[i];
          appendEvent(event);
        }
      } else {
        console.log("no events");
      }
    });
};
//------------------------------------------------------------------------------------------
// Triggered when the "Save" button is pressed by the user
// gets google to create and event with the title, desciption and start and end times
// to identify that this event is created by sesami -event created by sesami- is added
// to the description
// IMPORTANT---user enetered END DATE and START DATE must be very specifically
//  in the format of:  yyyy-mm-ddY00:00:00
const handleAddEventClick = () => {
  let newEventTitle = document.getElementById("newEventTitle").value;
  let newEventDescription = document.getElementById("newEventDescription")
    .value;
  let newEventStart = document.getElementById("newEventStart").value;
  let newEventEnd = document.getElementById("newEventEnd").value;

  var event = {
    summary: newEventTitle,
    location: "online",
    description: newEventDescription + " -event created by sesami-",
    start: {
      dateTime: newEventStart + "-04:00"
    },
    end: {
      dateTime: newEventEnd + "-04:00"
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 }
      ]
    }
  };

  let request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event
  });
  request.execute(event => {
    // adds the event to the list of new events
    appendEvent(event, true);
  });
};
//___________________________________________________________________________________________

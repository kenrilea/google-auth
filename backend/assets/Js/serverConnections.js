let objectToText = object => {
  let keys = Object.keys(object);
  console.log(keys);
  let dataTransferString = "";
  keys.forEach(key => {
    objString = "" + key;
    objString =
      objString +
      "$Object_Key$" +
      "start" +
      "$Object_Value$" +
      object[key].start.dateTime;
    objString =
      objString +
      "$Object_Key$" +
      "end" +
      "$Object_Value$" +
      object[key].end.dateTime;
    objString =
      objString +
      "$Object_Key$" +
      "description" +
      "$Object_Value$" +
      object[key].description;
    objString =
      objString +
      "$Object_Key$" +
      "summary" +
      "$Object_Value$" +
      object[key].summary;
    objString = objString + "$End_Object$";
    dataTransferString = dataTransferString + objString;
  });
  return dataTransferString;
};

let sendCalendar = (user, events) => {
  let eventsObj = {};
  events.forEach(event => {
    eventsObj[event.id] = event;
  });
  let data = new FormData();
  data.append("user", user);
  data.append("calendar", objectToText(eventsObj));
  fetch("http://localhost:4000/calendar", { method: "POST", body: data });
};
let sendEvent = (user, event) => {
  let data = new FormData();
  data.append("user", user);
  let eventId = event.id;
  let objectToTextParam = {};
  objectToTextParam[eventId] = event;
  console.log(objectToTextParam);
  data.append("event", objectToText(objectToTextParam));
  fetch("http://localhost:4000/event", { method: "POST", body: data });
};

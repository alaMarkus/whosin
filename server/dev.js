//const query = require("./database/eventQuery")

mockEvent = {
    "eventname": "jouluaatto",
    "date": "24.12.2020",
    "maxparticipants": 10,
    "price": 45.75,
    "priceForGroup": true,
}


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  console.log(makeid());
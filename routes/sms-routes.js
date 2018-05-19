var db = require("../models");
var request = require('request')


//TWILLIO
var accountSid = 'AC7dd25431df6ebe89ff9a8e3ab436c361';
var authToken = '1e4c9f348933c81fd4d34b2709b1587c';
var client = require('twilio')(accountSid, authToken);

setInterval(checkTimeToSend, 10000)

function checkTimeToSend () {
    console.log("interval!");
db.Goal.findAll({}).then(function(goal){
    console.log(goal[0].dataValues)
    //Loops through each goal to check if current time matches reminder time.
    for (var i = 0; i < goal.length; i++) {
        var reminder = goal[0].dataValues.reminderTime;
        var message = `Hey, it's M0T1V8R: It's time to track your goal: (${goal[0].dataValues.activity})!`;
        var phoneNumber = '+18043323111';
        console.log("Remind at: "+ reminder);
        //Checks if it's time to send message and sends the message if true
        checkTime(reminder, phoneNumber, message)
    }
})
};

//Checks the current time with user selected send sms time
var checkTime = function (timeToSend, phoneNumber, message){
    var d=new Date();
    if(d.getHours()==timeToSend ) {
      // special script
        console.log("\n\n\nTime to send!");
        sendMessage(phoneNumber, message);
     }
     else{
      //rest of the script
      console.log("\n\n\nnot time")
     }
  }

  function sendMessage (phoneNumber, message) {
    client.messages
    .create({
       body: message,
       from: '+18045711241',
       to: phoneNumber,
     })
    .then(message => console.log(message.sid))
    .done();
  }


module.exports = function(app) {

}
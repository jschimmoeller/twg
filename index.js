var Alexa = require('alexa-sdk');

exports.handler = function(event, context) {
  console.log("====================");
  console.log("REQUEST: " + JSON.stringify(event));
  console.log("====================");

  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        console.log("in LaunchRequest");
        this.response.speak('Time with God.  What would you like to do?')
                    .listen('For what day?');
        this.emit(':responseReady');
        //this.emit(':elicitSlot', 'date', "For what day?", "what day?");
    },
    'TimeWithGod' : function () {
        console.log('>>>', JSON.stringify(this))

        let speechOutput = "Amen Amen Amen ";
        if (this.hasOwnProperty("event")  && this.event.hasOwnProperty("request") &&
          this.event.request.hasOwnProperty("intent") &&
          this.event.request.intent.hasOwnProperty("slots") &&
          this.event.request.intent.slots.hasOwnProperty("date") &&
          this.event.request.intent.slots.date.hasOwnProperty('value')){
           speechOutput += this.event.request.intent.slots.date.value ;
        }
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("This is time with god. " + "You can say, start or go; for a specific date say play followed by .");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, open time with god for today' ");
    }
};

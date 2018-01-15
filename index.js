var Alexa = require('alexa-sdk');

exports.handler = function(event, context) {
  console.log("====================");
  console.log("REQUEST: " + JSON.stringify(event));
  console.log("====================");

  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};


function delegateSlotCollection() {
    console.log("in delegateSlotCollection");
    console.log("current dialogState: " + this.event.request.dialogState);

    if (this.event.request.dialogState === "STARTED") {
        console.log("in STARTED");
        console.log(JSON.stringify(this.event));
        var updatedIntent=this.event.request.intent;
        return this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        console.log(JSON.stringify(this.event));
        var updatedIntent=this.event.request.intent;
        return this.emit(":delegate", updatedIntent);
    } else {
        console.log("in completed");
        //console.log("returning: "+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent.slots;
    }
}


function getSlotValues (filledSlots) {
  //given event.request.intent.slots, a slots values object so you have
  //what synonym the person said - .synonym
  //what that resolved to - .resolved
  //and if it's a word that is in your slot values - .isValidated
  let slotValues = {};

  console.log('The filled slots: ' + JSON.stringify(filledSlots));
  Object.keys(filledSlots).forEach(function(item) {
  //console.log("item in filledSlots: "+JSON.stringify(filledSlots[item]));
  var name = filledSlots[item].name;
  //console.log("name: "+name);
  if(filledSlots[item]&&
     filledSlots[item].resolutions &&
     filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
     filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
     filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {

      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
          case "ER_SUCCESS_MATCH":
              slotValues[name] = {
                  "synonym": filledSlots[item].value,
                  "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                  "isValidated": true
              };
              break;
          case "ER_SUCCESS_NO_MATCH":
              slotValues[name] = {
                  "synonym": filledSlots[item].value,
                  "resolved": filledSlots[item].value,
                  "isValidated":false
              };
              break;
          }
      } else {
          slotValues[name] = {
              "synonym": filledSlots[item].value,
              "resolved": filledSlots[item].value,
              "isValidated": false
          };
      }
  },this);
  //console.log("slot values: "+JSON.stringify(slotValues));
  return slotValues;
}

var handlers = {
    'NewSession': function() {
        console.log("in NewSession");
        // when you have a new session,
        // this is where you'll
        // optionally initialize

        // after initializing, continue on
        routeToIntent.call(this);
    },
    'LaunchRequest': function () {
        console.log("in LaunchRequest");
        this.response.speak('Welcome to time with God. I will moderate your devotional time with the father.');
        this.response.listen('To start say "let us pray" or say "open yesterday" if you missed a day');
        this.emit(':responseReady');
    },
    'TimeWithGod' : function () {
        // delegate to Alexa to collect all the required slots
        let filledSlots = delegateSlotCollection.call(this);

        // console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = getSlotValues(filledSlots);

        // console.log("slotValues: ", slotValues);

        let speechOutput = "Amen Amen Amen";
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
        this.response.speak("This is time with god. " + "You can say, start .");
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

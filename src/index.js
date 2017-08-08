'use strict';
var Alexa = require('alexa-sdk');
var Weather = require('./weather');

var APP_ID = 'arn:aws:lambda:us-east-1:497766007594:function:WeatherKnot';
var languageString = {
    'en': {
        'translation': {
            'CAST_MESSAGE': '%PLACE% is %WEATHER% %TIME%.',
            'HELP_MESSAGE': 'Ask weather, for example, how is the weather today in Atlanta?',
            'FAIL_MESSAGE': 'There are some issues connecting weather broadcast server. Please try again later.',
            'CITY_MESSAGE': 'The weather information for place %s is not found, please try another city or zip code.',
            'TIME_MESSAGE': 'I am only able to forecast weather up to seven days for now.'
        }
    } 
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    // alexa.appId = APP_ID;
    alexa.resources = languageString;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'AskIntent': function() {
        console.log('launch!');
        console.log(this.event.request.intent.slots);
        this.emit(':tell', 'something to say');
    },
    'Unhandled': function() {
        this.emit(':tell', 'unknown request');
    }
};
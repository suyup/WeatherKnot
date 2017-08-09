'use strict';
var Alexa = require('alexa-sdk');
var Weather = require('./weather');

var APP_ID = 'arn:aws:lambda:us-east-1:497766007594:function:WeatherKnot';
var languageString = {
    'en': {
        'translation': {
            'CAST_MESSAGE': 'Weather %s in %s is %s.',
            'TEMP_MESSAGE': ' Average temperature is %s Celsius degree.',
            'HELP_MESSAGE': 'Ask weather, for example, how is the weather today in Atlanta?',
            'FAIL_MESSAGE': 'There are some issues connecting weather provider server. Please try again later.',
            'CITY_MESSAGE': 'The weather information for %s %s is not found, please try another city or zip code.',
            'TIME_MESSAGE': 'I am only able to forecast weather up to seven days for now.',
            'ECHO_MESSAGE': 'An Alexa skill invocation issue happened.',
            'CONS_MESSAGE': 'Cannot determine current location. Please go to Alexa app and grant permission.'
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
    'LaunchRequest': function() {
        this.emit('AskIntent');
    },
    'AskIntent': function() {
        let intent = this.event.request.intent;
        let attributes = {};
        if (intent && intent.slots) {
            try {
                parseRequest.call(this, intent.slots, attributes);

                Weather.weather(attributes, (data) => {
                    try {
                        if ('error' in data ) {
                            throw data.error;
                        }
                        parseResponse.call(this, data, attributes);
                        console.log(attributes);

                        let message = this.t('CAST_MESSAGE', 'now', attributes.city, attributes.weather);
                        if ('temp' in attributes) {
                            message += this.t('TEMP_MESSAGE', attributes.temp);
                        }
                        this.emit(':tell', message);
                    } catch (error) {
                        this.emit(':tell', error.message);
                    }
                });
            } catch (error) {
                this.emit(':tell', error.message);
            }
        } else {
            this.emit(':tell', this.t('ECHO_MESSAGE'));
        }
    },
    'Unhandled': function() {
        this.emit(':tell', this.t('HELP_MESSAGE'));
    }
};

function parseRequest(slots, attr) {
    if ('zip' in slots && 'value' in slots.zip) {
        const zip = parseInt(slots.zip.value);
        if (!isNaN(zip) && zip > 0 && zip < 99999) {
            attr.zip = slots.zip.value;
        } else {
            throw new Error(this.t('CITY_MESSAGE', 'zip code', slots.zip.value));
        }
    } else if ('city' in slots && 'value' in slots.city) {
        if (/^( ?\.?[a-zA-Z]+)+$/i.test(slots.city.value)) {
            attr.city = slots.city.value;
        } else {
            throw new Error(this.t('CITY_MESSAGE', 'city', slots.city.value));
        }
    } else {
        // TODO: fall back to device location
        throw new Error(this.t('CONS_MESSAGE'));
    }

    attr.timeValue = toEpoch(Date.today());

    if ('date' in slots && 'value' in slots.date) {
        attr.date = slots.date.value;
        const epoch = toEpoch(attr.date);
        if (!isNaN(epoch)) {
            attr.timeValue = epoch;
        } else {
            throw new Error(this.t('TIME_MESSAGE'));
        }
    }
    if ('time' in slots && 'value' in slots.time) {
        attr.time = slots.time.value;
        // TODO: parse time description
    }
}

function parseResponse(json, attr) {
    if ('name' in json) {
        attr.city = json.name;
    }
    if ('weather' in json && json.weather.length > 0 && json.weather[0].description) {
        attr.weather = json.weather[0].description;
    } else {
        throw new Error(this.t('FAIL_MESSAGE'));
    }
    if ('main' in json && 'temp' in json.main) {
        attr.temp = (parseFloat(json.main.temp) - 273.15).toFixed(1);
    }
    // TODO: wind, humidity
}

/// ultilities

Date.today = function() {
    const date = new Date();
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
};

function toEpoch(date) {
    return Date.parse(date);
}

function toDate(epoch) {
    const date = new Date(0);
    date.setUTCSeconds(epoch);
    return date;
}

// /// test code
// this.emit = function(action, message) {
//     console.log(`${action}: ${message}`);
// }
//
// this.t = function(key) {
//     return languageString.en.translation[key];
// }
//
// var TestRequest = require('../request.js');
// this.event = TestRequest.event;
// handlers.AskIntent.call(this);

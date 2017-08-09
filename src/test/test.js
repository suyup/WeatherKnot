
/// test code

var Entry = require('../index.js');
var TestRequest = require('./event.js');

Entry.emit = function(action, message) {
    console.log(`${action}: ${message}`);
}

Entry.t = function(key) {
    return Entry.languageString.en.translation[key];
}

Entry.event = TestRequest.event;

Entry.AlexaResponseHandlers.AskIntent.call(Entry);

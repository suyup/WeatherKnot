

var request = {  
    "session":{  
        "sessionId":"SessionId.xxxxxxxxxxxxxxx",
        "application":{  
            "applicationId":"amzn1.ask.skill.xxxxxxxxxxxx"
        },
        "attributes":{  

        },
        "user":{  
            "userId":"amzn1.ask.account.xxxxx"
        },
        "new":false
    },
    "request":{  
        "type":"IntentRequest",
        "requestId":"EdwRequestId.xxxxxxxxxxxxxxx",
        "locale":"en-US",
        "timestamp":"2017-08-09T00:06:25Z",
        "intent":{  
            "name":"AskIntent",
            "slots":{  
                "date":{  
                    "name":"date",
					"value":"2017-08-08"
                },
                "preposition_time":{  
                    "name":"preposition_time",
                    "value":"on"
                },
                "preposition_location":{  
                    "name":"preposition_location"
                },
                "city":{  
                    "name":"city",
					"value":"N.Y.C"
                },
                "weather":{  
                    "name":"weather"
                },
                "time":{  
                    "name":"time",
                    "value":"AF"
                }
            }
        }
    },
    "version":"1.0"
};

var event = {
	'event': request
};

module.exports = event;
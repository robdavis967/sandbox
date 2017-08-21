'use strict';

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = "What up dudes? " +
        "Whats the password?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'I need the password. Whats the password?';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying Henrys cool skill. Disney is a really cool park. Henry loves his family. duh';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function handleRecipe(intent, session, callback) {
	const apiKey = '663de71f2d047294297ed7235e11e392';
    var stocks = [ 'butter', 'flour', 'milk' ];

    var http = require( 'http' );
 
    var url = 'http://food2fork.com/api/search?key=' + apiKey + "&q=";
    url += 'butter, flour, milk';

    http.get( url, 
		function( response ) 
		{
			var data = '';
			response.on( 'data', 
				function( x ) 
				{ 
					data += x; 
				}
			);
			response.on( 'end', 
				function() 
				{
					var json = JSON.parse( data );
					var text = 'Here is one suggested recipe. ';
					
					var recipe = json.query.results.recipes[0];
					if ( quote.Name ) 
					{
						text += recipe.title;
					}
					let speechOutput = text;
					let repromptText = "Say something else that's awesome or get stock picks.";
					let sessionAttributes = {"passwordEntered" : "true"};
					callback(sessionAttributes,
						 buildSpeechletResponse(intent.name, speechOutput, repromptText, false));
				} 
			);
		} 
	);
}

function handleStock(intent, session, callback) {
     var stocks = [ 'AAPL', 'GOOG', 'AMZN' ];

    var http = require( 'http' );
 
    var url = 'http://query.yahooapis.com/v1/public/yql';
    url += '?q=select * from yahoo.finance.quotes where symbol in (';
    url += '"' + stocks + '"'; 
    url += ')&env=store://datatables.org/alltableswithkeys&format=json';

    http.get( url, 
		function( response ) 
		{
			var data = '';
			response.on( 'data', 
				function( x ) 
				{ 
					data += x; 
				}
			);
			response.on( 'end', 
				function() 
				{
					var json = JSON.parse( data );
					var text = 'Here are your stock quotes: ';
					for ( var i=0 ; i < stocks.length ; i++ ) 
					{
						var quote = json.query.results.quote[i];
						if ( quote.Name ) 
						{
							text += quote.Name + ' at ' + quote.Ask
								+ ' dollars, a change of '
								+ quote.Change + ' dollars. ';
						}
					}
					let speechOutput = text;
					let repromptText = "Say something else that's awesome or get stock picks.";
					let sessionAttributes = {"passwordEntered" : "true"};
					callback(sessionAttributes,
						 buildSpeechletResponse(intent.name, speechOutput, repromptText, false));
				} 
			);
		} 
	);
	
}

function handleAnswer(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
	let	sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';
	let answer = "that";
	if(intent.slots && intent.slots.Answer && intent.slots.Answer.value)
	{
		answer = intent.slots.Answer.value.toLowerCase();
	}
    console.log(answer);

	if(!session.attributes || !session.attributes.passwordEntered)
	{
		switch(answer)
		{
			case "pass word":
			case "password":
				speechOutput = "Hi Henry! Thanks for entering the password! Now, say something awesome.";
				repromptText = "Come on. Say something awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
				break;
			default:
				speechOutput = answer + " isnt the password. Whats the password?";
				repromptText = "Whats the password?";
				sessionAttributes = {"passwordEntered" : false};
		}
	}
	else
	{
		switch(answer)
		{
			case "henry":
			case "andy":
			case "emily":
			case "mommy":
			case "daddy":
			case "nana":
			case "loki":
			case "crow":
			case "disney":
			case "coffee":
				speechOutput = answer + " is pretty awesome.";
				repromptText = "Say something else that's awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
				break;
			case "ninjas":
				speechOutput = answer + " are pretty awesome.";
				repromptText = "Say something else that's awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
				break;
			case "rocky":
				speechOutput = answer + " is an awesome potato.";
				repromptText = "Say something else that's awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
				break;
			case "fist bumps":
			case "fistbumps":
				speechOutput = answer + " are awesome. ba la la lala lala.";
				repromptText = "Say something else that's awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
				break;
			case "christmas":
				speechOutput = answer + " is REALLY awesome. fa la la lala.";
				repromptText = "Say something else that's awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
				break;
			case "santa claus":
			case "santa":
				speechOutput = answer + " is definitely awesome, and he knows when you are sleeping. Creepy.";
				repromptText = "Say something else that's awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
				break;
			default:
				speechOutput = answer + " isn't awesome.";
				repromptText = "I said to say something awesome.";
				sessionAttributes = {"passwordEntered" : "true"};
		}
	}

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

	console.log(intentName);
    // Dispatch to your skill's intent handlers
    if (intentName === 'HandleAnswer') {
        handleAnswer(intent, session, callback);
	}
    else if (intentName === 'HandleStock') {
        handleStock(intent, session, callback);
	}
    else if (intentName === 'HandleRecipe') {
        handleRecipe(intent, session, callback);
    } else if (intentName == "AMAZON.StopIntent" || intentName == "AMAZON.CancelIntent") {
        handleSessionEndRequest(callback);
    } else {
        handleAnswer(intent, session, callback);
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session, callback) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        }
    } catch (err) {
        callback(err);
    }
};

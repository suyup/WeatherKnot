
var Server = require('./server');

function buildURL(attributes) {

	const schema = 'http';
	const host = 'api.openweathermap.org';
	
	// TODO:
	// /forecast
	// /forecast/daily
	// /weather
	let path = '/data/2.5/weather';

	const queryItems = {
		appid: '9d4e1543d3ffc46242dc10c4a9a77227'
	};
	if ('zip' in attributes) {
		queryItems.zip = attributes.zip;
	} else if ('city' in attributes) {
		queryItems.q = attributes.city;
	}
	
	var encodedQuery = (items) => {
	    return Object.keys(items).map(function(key) {
	        return [key, items[key]].map(encodeURIComponent).join("=");
	    }).join("&");
	}

	return `${schema}://${host}${path}?${encodedQuery(queryItems)}`;
}

exports.weather = function(attributes, callback) {
	const url = buildURL(attributes);
	console.log(`GET ${url}`);
	Server.httpRequest(url, callback);
};

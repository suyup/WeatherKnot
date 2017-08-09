
let http = require('http');

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

function weather(attributes, callback) {
	
	const url = buildURL(attributes);
	console.log(`GET ${url}`);
	
    http.get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
		console.log(`${statusCode}, content-type: ${contentType}`);
		
        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
        }
        if (error) {
            // consume response data to free up memory
            res.resume();
			callback({ "error": error });
            return;
        }
    
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
			let data = '';
            try {
                data = JSON.parse(rawData);
            } catch (e) {
                data = { "error": error };
            } finally {
                rawData = '';
				callback(data);
            }
        });
    }).on('error', (error) => {
        callback({ "error": error });		
    });   
}

exports.weather = weather;

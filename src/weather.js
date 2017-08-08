
let http = require('http');

function weather() {
    let options = {
        hostname: 'api.openweathermap.org',
        path: '/data/2.5/forecast/daily?id=524901&appid=9d4e1543d3ffc46242dc10c4a9a77227'
    };
    
    http.get(options, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
    
        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }
    
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                var parsedData = JSON.parse(rawData);
                console.log(parsedData);
            } catch (e) {
                console.error(e.message);
            } finally {
                rawData = '';
                console.log(parsedData['city']['name']);
                console.log(parsedData['list'][0])
            }
        });
    }).on('error', (e) => {
        console.error(`get error ${e.message}`);
    });   
}

exports.weather = weather;

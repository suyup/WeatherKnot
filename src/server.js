
var http = require('http');

exports.httpRequest = function(url, callback) {
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
};

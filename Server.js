var http = require('http');

var server = http.createServer(function (req, res) {
    if(req.url=='/utenti'){
        console.log("connesso")
    }
    if (req.url == '/utenti' && req.method === 'POST') {
        console.log("collegato");

        // Initialize an empty string to store the incoming data
        let requestBody = '';

        // Listen for the 'data' event to accumulate the incoming data
        req.on('data', (chunk) => {
            requestBody += chunk;
        });

        // Listen for the 'end' event to process the complete body
        req.on('end', () => {
            try {
                // Parse the JSON data from the request body
                const body = JSON.parse(requestBody);

                // Now 'body' contains the parsed JSON data
                console.log('Received body:', body);

                // You can use the 'body' variable as needed in your logic

                // Respond to the client as needed
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Received and processed the data\n');
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request\n');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
    }
});

server.listen(9001);

console.log('Node.js web server at port 9001 is running..');

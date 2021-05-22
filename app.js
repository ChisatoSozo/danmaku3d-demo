const express = require('express');
const path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

const app = express();

var privateKey = fs.readFileSync('privkey.pem');
var certificate = fs.readFileSync('cert.pem');
var credentials = { key: privateKey, cert: certificate };

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);

console.log('App is listening');
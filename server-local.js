/*
 * Purely for local development purposes, as the redirect URI must be HTTPS
 */
var https = require('https');
var selfSigned = require('openssl-self-signed-certificate');

var app = require('./server');

var httpsPort = process.env.HTTPS_PORT || 3001;

var options = {
    key: selfSigned.key,
    cert: selfSigned.cert
};

https.createServer(options, app).listen(httpsPort);
console.log(`HTTPS started on port ${httpsPort} (dev only).`);

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csrf = require('csurf');

var request = require('superagent');

var port = process.env.PORT || 3000;
var httpsPort = process.env.HTTPS_PORT || 3001;
var defaultScope = 'Analytics:MetronAPI:CreateGetDeleteAggregators,NoSQL core:*:*';
var getRedirectUri = function(req) { return req.protocol + "://" + req.headers.host + "/callback"; };

var cookieName = "application-data-api-demo",
    cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
};

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrf({ cookie: true }));

var oauth2 = require('simple-oauth2')({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    site: process.env.AUTH_SITE,
    tokenPath: process.env.TOKEN_PATH,
    authorizationPath: process.env.AUTHORIZATION_PATH,
    // currently only accept credentials in the header
    useBasicAuthorizationHeader: true,
    useBodyAuth: false
});

app.get('/', function(req, res) {
    var locals = {
        csrfToken: req.csrfToken(),
        scope: defaultScope
    };

    res.render('index', locals);
});

app.post('/auth', function(req, res) {
    var authorization_uri = oauth2.authCode.authorizeURL({
        redirect_uri: getRedirectUri(req),
        scope: req.body.scope,
        // Generate a secure state in production to prevent CSRF (https://tools.ietf.org/html/rfc6749#section-10.12)
        state: "f4c269a0-4a69-43c1-9405-86209c896fa0"
    });

    res.redirect(authorization_uri);
});

app.get('/callback', function(req, res) {
    // Validate req.query.state before continuing in production to prevent CSRF (https://tools.ietf.org/html/rfc6749#section-10.12)
    var code = req.query.code;

    oauth2.authCode.getToken({
        code: code,
        redirect_uri: getRedirectUri(req)
    }, getData);

    function getData(error, result) {
        if (error) {
            console.log('Access Token Error', error.message);
            res.redirect('/');
        } else {
            var token = oauth2.accessToken.create(result).token;
            // save token.refresh_token here to a user context

            res.cookie(cookieName, { accessToken: token.access_token }, cookieOptions);
            res.redirect('/data');
        }
    }
});

app.get('/data', function(req, res) {
    var access_token = req.cookies[cookieName].accessToken;

    request
        .get(process.env.COURSE_ACCESS_ROUTE)
        .set('Authorization', `Bearer ${access_token}`)
        .end(function(err, courseAccessResponse) {
            res.send(courseAccessResponse.text);
        });
});

app.listen(port);
console.log(`HTTP started on port ${port}.`);

if (process.env.NODE_ENV !== 'production') {
    var https = require('https');
    var selfSigned = require('openssl-self-signed-certificate');

    var options = {
        key: selfSigned.key,
        cert: selfSigned.cert
    };

    https.createServer(options, app).listen(port + 1);
    console.log(`HTTPS started on port ${port + 1} (dev only).`);
}

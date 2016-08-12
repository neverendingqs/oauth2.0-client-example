# OAuth 2.0 Client Example
Using the OAuth 2.0 flow to get data from the application and data APIs.

## Environment Variables
If running locally, ensure `.devenv.json` contains the following values:

	{
	    "CLIENT_ID": "4b00c5f8-9331-45ff-9664-dcdd36dc4522",
	    "CLIENT_SECRET": "thesecret",
	    "AUTH_SITE": "https://auth.brightspace.com",
	    "TOKEN_PATH": "/core/connect/token",
	    "AUTHORIZATION_PATH": "/oauth2/auth",
	    "RESOURCE_ENDPOINT": "<resource_endpoint>"
	}

Otherwise, ensure these environment variable exists on the host machine.


# OAuth 2.0 Client Example

This is a demonstration of how to obtain an access token to call Brightspace APIs on behalf of a user via the [authorization code grant flow](https://tools.ietf.org/html/rfc6749#section-4).

## How to run this sample

This sample is not production-ready as-is, and is meant to only run locally.

### Pre-requisites

This sample uses [Node.js](https://nodejs.org), and it must be installed before proceeding.

Use `https://localhost:3001/callback` when providing the redirect URI during application registration.

### Environment variables

These environment variables must be set:

* CLIENT_ID
  * The OAuth 2.0 client ID (available from the Brightspace OAuth 2.0 registration page)
* CLIENT_SECRET
  * The OAuth 2.0 client secret (available from the Brightspace OAuth 2.0 registration page)
* RESOURCE_ENDPOINT
  * The endpoint that contains the resource of interest (e.g. `https://myschool.brightspace.com/d2l/api/lp/1.0/users/whoami`)

A file named `.devenv.json` with the following structure can be used to automatically set environment variables:

```js
{
    "CLIENT_ID": "<client_id>",
    "CLIENT_SECRET": "<client_secret>",
    "RESOURCE_ENDPOINT": "<resource_endpoint>"
}
```

### Running the sample

Run the following:
```
npm install
npm run dev
```

Then navigate to `https://localhost:3001/`.

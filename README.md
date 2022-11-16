person-service-js
=================

## About

The JavaScript implementation of REST API endpoints of a simple person service.

It is a standalone application that holds the REST endpoint implementations of the person backend services written in JavaScript.

Note: This repository is made for demonstration purposes to the [easer server](http://github.com/tombenke/easer).

## Installation

Clone the repository:

```bash
git clone git@github.com:tombenke/person-service-js.git
```

Install the dependencies:

```bash
cd person-service-js
npm install
```
## Build

Build the script from the `src/` folder:

```bash
npm run build
```

The results will go to the `dist/` folder.

## Usage

Make sure that there is a NATS server running, and its URI properly is defined correctly [in the index.js](https://github.com/tombenke/person-service-js/blob/038cb5d3155703fafd4753bdfa0bf765ed69b34d/index.js#L188).

Start the service:

```bash
node dist/index.js
```

Execute some REST requests to the persons API:

```bash
curl http://localhost:3007/persons
[]

curl -X PUT http://localhost:3007/persons/skywalker -H "Content-type: application/json" -d '{"id":"skywalker","familyName":"Skywalker","givenName":"Luke"}'
{"id":"skywalker","familyName":"Skywalker","givenName":"Luke"}


curl http://localhost:3007/persons
[{"id":"skywalker","familyName":"Skywalker","givenName":"Luke"}]

curl http://localhost:3007/persons/skywalker
{"id":"skywalker","familyName":"Skywalker","givenName":"Luke"}

curl -X DELETE http://localhost:3007/persons
[]

curl http://localhost:3007/persons
[]

curl http://localhost:3007/persons/skywalker -v
*   Trying 127.0.0.1:3007...
* Connected to localhost (127.0.0.1) port 3007 (#0)
> GET /persons/skywalker HTTP/1.1
> Host: localhost:3007
> User-Agent: curl/7.81.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 0
< ETag: W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"
< Date: Wed, 16 Nov 2022 20:01:49 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
```

## Get Help

To learn more about the functions visit the [easer tutorial](http://tombenke.github.io/easer/tutorial-1).


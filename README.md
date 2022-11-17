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

### Prerequisites

In order to use this service, you need the REST API gateway with the persons endpoint.

Clone the [person-rest-api](https://github.com/tombenke/person-rest-api) project int a directory named `person-rest-api`,
and install it according to its README:

```bash
cd person-rest-api
task install
```

### Start the API gateway

In the `person-rest-api` directory, start the mock server in dynamic mode:

```bash
task start-mock-server-dynamic
```

### Start the endpoint services

Make sure that the [person-rest-api](https://github.com/tombenke/person-rest-api) gateway is running,
then start the JavaScript service functions, that implement the endpoints:

```bash
node dist/index.js
```

### Use the endpoint servies via the REST API

Execute some REST requests to the persons API using REST clienst, e.g. curl.

Get the list of all persons:

```bash
curl http://localhost:3007/persons

[]
```

Upload a new person using it full-name as ID

```bash
curl -X PUT http://localhost:3007/persons/luke-skywalker -H "Content-type: application/json" -d '{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Luke"}'

{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Luke"}
```

Get the list to see if the newly uploaded person appears in the list:

```bash
curl http://localhost:3007/persons/

[{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Luke"}]
```

Get a selected person by its ID:
```bash
curl http://localhost:3007/persons/luke-skywalker

{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Luke"}
```

Update a propery of an existing person:
```bash
curl -X PUT http://localhost:3007/persons/luke-skywalker -H "Content-type: application/json" -d '{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Lucas"}'

{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Lucas"}
```

Delete all persons:
```bash
curl -X DELETE http://localhost:3007/persons

[]
```

Check if persons are really removed:
```bash
curl http://localhost:3007/persons

[]
```

Try to access a non-existing person, to see that you got a `404 Not Found` response:
```bash
curl http://localhost:3007/persons/luke-skywalker -v

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

Try to call an existing endpoint with a method that is not implemented,
so that you got a `501 Not Implemented` response:
```bash
curl -X POST http://localhost:3007/persons -v

*   Trying 127.0.0.1:3007...
* Connected to localhost (127.0.0.1) port 3007 (#0)
> POST /persons HTTP/1.1
> Host: localhost:3007
> User-Agent: curl/7.81.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 501 Not Implemented
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 0
< ETag: W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"
< Date: Thu, 17 Nov 2022 06:56:45 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
```

## Get Help

See also the [easer tutorial](http://tombenke.github.io/easer/tutorial-1).


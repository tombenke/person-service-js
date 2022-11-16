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

## Usage

Make sure that there is a NATS server running, and its URI properly is defined correctly [in the index.js](https://github.com/tombenke/person-service-js/blob/038cb5d3155703fafd4753bdfa0bf765ed69b34d/index.js#L188).

Start the service:

```bash
$ node index.js

```

## Get Help

To learn more about the functions visit the [easer tutorial](http://tombenke.github.io/easer/tutorial-1).


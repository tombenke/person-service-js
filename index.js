const Hemera = require('nats-hemera')
const nats = require('nats')
const _ = require('lodash')

/**
 * The in-memory dictionary of person descriptors
 */
let persons = {}

/**
 * Delete all persons from the in-memory persons dictionary
 *
 * @return [Array] The list of persons (an empty array).
 *
 * @function
 */
const deleteAllPersons = () => {
    persons = {}
    return findAllPersons()
}

/**
 * Find all persons in the in-memory persons dictionary
 *
 * @return [Array] The list of persons found.
 *
 * @function
 */
const findAllPersons = () => _.map(persons, value => value)

/**
 * Find a person by its unique ID
 *
 * @arg {String} id - The unique ID of the person to find
 *
 * @return [Object] The person object found, or `null` if not found.
 *
 * @function
 */
const findPersonById = id => _.get(persons, id, null)

/**
 * Find a person by its ID and update, or create if it does not found.
 *
 * @arg {String} person - The person object to update, including it `id` property.
 *
 * @return [Object] The updated or created person object.
 *
 * @function
 */
const upsertPerson = person => {
    persons[person.id] = person
    return persons[person.id]
}

/**
 * Default header(s) for JSON-type responses
 */
const defaultHeaders = {
    "Content-type": "application/json"
}

/**
 * Serve the `GET /persons` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
const getPersonsServiceHandler = (data, cb) => {
    // console.log(JSON.stringify(data, null, 2))
    cb(null, {
        status: 200,
        headers: defaultHeaders,
        body: findAllPersons()
    })
}

/**
 * Serve the `POST /persons` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
const postPersonsServiceHandler = (data, cb) => {
    // NOTE: This endpoint is intentionally not implemented,
    // and actually should never be called
    cb(null, { status: 501 })
}

/**
 * Serve the `DELETE /persons` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
const deletePersonsServiceHandler = (data, cb) => {
    cb(null, {
        status: 200,
        headers: defaultHeaders,
        body: deleteAllPersons()
    })
}

/**
 * Serve the `GET /persons` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
const getPersonServiceHandler = (data, cb) => {
    const personId = data.request.parameters.uri.personId

    const personFound = findPersonById(personId)
    if (personFound !== null) {
        cb(null, {
            status: 200,
            headers: defaultHeaders,
            body: personFound
        })
    } else {
        // There is no such resource
        cb(null, { status: 404 })
    }
}

/**
 * Serve the `PUT /persons` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
const putPersonServiceHandler = (data, cb) => {
    const personId = data.request.parameters.uri.personId
    const person = data.request.body

    if (personId === _.get(person, 'id', null)) {
        cb(null, {
            status: 200,
            headers: defaultHeaders,
            body: upsertPerson(person)
        })
    } else {
        cb(null, {
            status: 400,
            headers: defaultHeaders,
            body: { error: "Wrong or missing request parameters" }
        })
    }
}

/**
 * Set-up the services
 *
 * Connects to the NATS, registers the service endpoint handler functions through the `pdmsTopic`.
 * When a matching pattern arrives, serves the request, and responses to it.
 *
 * @function
 */
const startup = (config) => {
    const { natsUrl, natsTimeout, pdmsTopic } = config
    const natsConnection = nats.connect({ url: natsUrl })
    const hemera = new Hemera(natsConnection, {
        bloomrun: {
            indexing: 'depth'
        },
        timeout: natsTimeout
    })

    hemera.ready(() => {
        console.log('Hemera is connected')
        hemera.add({ topic: pdmsTopic, method: 'get', uri: '/persons/{personId}' }, getPersonServiceHandler)
        hemera.add({ topic: pdmsTopic, method: 'put', uri: '/persons/{personId}' }, putPersonServiceHandler)
        hemera.add({ topic: pdmsTopic, method: 'get', uri: '/persons' }, getPersonsServiceHandler)
        hemera.add({ topic: pdmsTopic, method: 'delete', uri: '/persons' }, deletePersonsServiceHandler)
        // The `POST /persons` handler is intentionally left out,
        // in order to demonstrate the combined static+dynamic mocking feature of the `easer` server
        // hemera.add({ topic: pdmsTopic, method: 'post', uri: '/persons' }, postPersonsServiceHandler)
    })
}

/**
 * Start the person-service application
 */
startup({
        // natsUrl: 'nats://demo.nats.io:4222',
        natsUrl: 'nats://localhost:4222',
        natsTimeout: 2000,
        pdmsTopic: 'person-demo'
    })

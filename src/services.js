import {
  deleteAllPersons,
  findAllPersons,
  findPersonById,
  upsertPerson,
} from './model';
import _ from 'lodash';

/**
 * Default header(s) for JSON-type responses
 */
const defaultResponseHeaders = {
  'Content-type': 'application/json',
};

const defaultPdmsResponseHeaders = {
  'content-type': 'application/json',
  'message-type': 'rpc/response',
};

/**
 * Serve the `GET /persons` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
export const getPersonsServiceHandler = (err, payload, headers) => {
  const responsePayload = {
    status: 200,
    headers: defaultResponseHeaders,
    body: findAllPersons(),
  };
  return {
    payload: JSON.stringify(responsePayload),
    headers: defaultPdmsResponseHeaders,
  };
};

/**
 * Serve the `POST /persons` requests
 *
 * NOTE: This endpoint is intentionally not implement any business logic,
 * and actually should never be called.
 * It returns an error response.
 *
 * @function
 */
export const postPersonsServiceHandler = (err, payload, headers) => {
  const responsePayload = {
    status: 501,
    headers: defaultResponseHeaders,
    body: null,
  };
  return {
    payload: JSON.stringify(responsePayload),
    headers: defaultPdmsResponseHeaders,
  };
};

/**
 * Serve the `DELETE /persons` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
export const deletePersonsServiceHandler = (err, payload, headers) => {
  const responsePayload = {
    status: 200,
    headers: defaultResponseHeaders,
    body: deleteAllPersons(),
  };
  return {
    payload: JSON.stringify(responsePayload),
    headers: defaultPdmsResponseHeaders,
  };
};

/**
 * Serve the `GET /persons/{personId}` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
export const getPersonServiceHandler = (err, payload, headers) => {
  const data = JSON.parse(payload);
  const personId = data.request.parameters.uri.personId;
  let responsePayload = {
    status: 404,
    headers: defaultResponseHeaders,
    body: null,
  };

  const personFound = findPersonById(personId);
  if (personFound !== null) {
    responsePayload = {
      status: 200,
      headers: defaultResponseHeaders,
      body: personFound,
    };
  }
  return {
    payload: JSON.stringify(responsePayload),
    headers: defaultPdmsResponseHeaders,
  };
};

/**
 * Serve the `PUT /persons/{personId}` requests
 *
 * Service endpoint implementation.
 *
 * @function
 */
export const putPersonServiceHandler = (err, payload, headers) => {
  console.log(payload);
  const data = JSON.parse(payload);
  const personId = data.request.parameters.uri.personId;
  const person = JSON.parse(Buffer.from(data.request.body.data).toString());

  console.log(
    'putPersonServiceHandler: %s, %s',
    personId,
    JSON.stringify(person)
  );
  let responsePayload = {
    status: 400,
    headers: defaultResponseHeaders,
    body: { error: 'Wrong or missing request parameters' },
  };

  if (personId === _.get(person, 'id', null)) {
    responsePayload = {
      status: 200,
      headers: defaultResponseHeaders,
      body: upsertPerson(person),
    };
  }
  return {
    payload: JSON.stringify(responsePayload),
    headers: defaultPdmsResponseHeaders,
  };
};

import 'babel-core/register';
import 'babel-polyfill';
import { connect, StringCodec, headers } from 'nats';
import {
  getPersonsServiceHandler,
  postPersonsServiceHandler,
  deletePersonsServiceHandler,
  getPersonServiceHandler,
  putPersonServiceHandler,
} from './services';

/**
 * Convert a normal JavaScript object to a NATS MsgHdrs object
 *
 * @arg {Object} msgHeadersObj - A flat, plain old JavaScript object,
 *                               where the property names represent the header names,
 *                               and the property values represent the header values.
 *
 * @return {Object} - The message headers in the form of MsgHdrs type object.
 *
 * @function
 */
const objToHdrs = (msgHeadersObj) => {
  const hdrs = headers();
  if (msgHeadersObj) {
    for (const property in msgHeadersObj) {
      hdrs.append(property, msgHeadersObj[property]);
    }
  }
  return hdrs;
};

/**
 * Convert NATS MsgHdrs object to a normal JavaScript object
 *
 * @arg {Object} hdrs - The message headers in the form of MsgHdrs type object.
 *
 * @return {Object} - A flat, plain old JavaScript object,
 *                    where the property names represent the header names,
 *                    and the property values represent the header values.
 *
 * @function
 */
const hdrsToObj = (hdrs) => {
  const obj = {};
  if (hdrs) {
    for (const [key] of hdrs) {
      obj[key] = hdrs.get(key);
    }
  }
  return obj;
};

/**
 * response assings a service handler callback function to a NATS topic.
 *
 * When a request message arrives to the topic, it calls the callback,
 * and responds to the requestor with the return values of the callback.
 *
 * @arg {Object} natsConnection - The NATS connection object
 * @arg {String} topic          - The name of the subject where the requests are coming
 * @arg {Function} respCb       - The response callback function.
 *
 * @function
 */
const response = (natsConnection, topic, respCb) => {
  console.debug(
    `Assign '${respCb.name}' callback function to '${topic}' topic`
  );
  return natsConnection.subscribe(topic, {
    callback: async (err, msg) => {
      const sc = StringCodec();
      const requestPayload = sc.decode(msg.data);
      const { payload = '', headers = {} } = respCb(
        err,
        requestPayload,
        hdrsToObj(msg.headers)
      );
      const hdrs = objToHdrs(headers);
      await msg.respond(sc.encode(payload), { headers: hdrs });
    },
  });
};

/**
 * Set-up the services
 *
 * Connects to the NATS, registers the service endpoint handler functions through the `pdmsTopic`.
 * When a matching pattern arrives, serves the request, and responses to it.
 *
 * @arg {Object} config - The NATS configuration parameters
 *
 * @function
 */
const startup = async (config) => {
  const { natsUrl, debug } = config;
  const natsConnection = await connect({ servers: natsUrl, debug: debug });

  // Bind service functions to NATS topics as request handlers
  response(natsConnection, 'get_/persons', getPersonsServiceHandler);
  response(natsConnection, 'post_/persons', postPersonsServiceHandler);
  response(natsConnection, 'delete_/persons', deletePersonsServiceHandler);
  response(natsConnection, 'get_/persons/{personId}', getPersonServiceHandler);
  response(natsConnection, 'put_/persons/{personId}', putPersonServiceHandler);
};

/**
 * Start the person-service application
 */
startup({
  natsUrl: 'nats://localhost:4222',
  natsTimeout: 2000,
  debug: false,
});

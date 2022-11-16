import _ from 'lodash';

/**
 * The in-memory dictionary of person descriptors
 */
let persons = {};

/**
 * Delete all persons from the in-memory persons dictionary
 *
 * @return [Array] The list of persons (an empty array).
 *
 * @function
 */
export const deleteAllPersons = () => {
  persons = {};
  return findAllPersons();
};

/**
 * Find all persons in the in-memory persons dictionary
 *
 * @return [Array] The list of persons found.
 *
 * @function
 */
export const findAllPersons = () => _.map(persons, (value) => value);

/**
 * Find a person by its unique ID
 *
 * @arg {String} id - The unique ID of the person to find
 *
 * @return [Object] The person object found, or `null` if not found.
 *
 * @function
 */
export const findPersonById = (id) => _.get(persons, id, null);

/**
 * Find a person by its ID and update, or create if it does not found.
 *
 * @arg {String} person - The person object to update, including its `id` property.
 *
 * @return [Object] The updated or created person object.
 *
 * @function
 */
export const upsertPerson = (person) => {
  persons[person.id] = person;
  return persons[person.id];
};

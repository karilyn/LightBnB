// const properties = require('./json/properties.json');
// const users = require('./json/users.json');
const { Pool } = require('pg');
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */


const getUserWithEmail = function(email) {
  return pool
    .query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email])
    .then((result) => {
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.error("User not found");
    });
}

if (require.main === module) {
  let result = getUserWithEmail("tristanjacobs@gmail.com");
  result.then((data) => {
    console.log(data);
    process.exit(0);
  });
}


exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
   .query(`SELECT id, name, email FROM users WHERE id = $1`, [id])
   .then((result) => {
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows;
    }
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0] || null;
    })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(userId, limit = 10) {
  return pool
    .query(`SELECT properties.*, start_date, end_date, cost_per_night, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN reservations on properties.id = reservations.property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2`, [userId, limit])
    .then((result) => result.rows || null);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  return pool
    //* .query returns a promise, so does .then
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return result.rows;
    })
    //* you don't actually need to do the error here because it's not an entry point to the client
    .catch((err) => {
      console.error(err);
      //* if we return the error the promise resolves, and if we throw it it
      //* gets passed to the next promise and then rejects
      throw err;
    })
};
exports.getAllProperties = getAllProperties;




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;


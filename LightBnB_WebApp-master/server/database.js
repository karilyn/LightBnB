const pool = require('./db/db');

// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email])
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      console.error("User not found")
      throw err;
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT id, name, email FROM users WHERE id = $1`, [id])
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryParams = [user.name, user.email, user.password]
  let queryString = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  return pool.query(queryString, queryParams)
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      console.error(err);
      throw err;
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
    .then((result) => result.rows)
    .catch((err) => {
      console.error(err);
      throw err;
    })
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
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  //* Adding to the options object
  // if city is passed into options object, append query to queryString
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE LOWER(city) LIKE LOWER($${queryParams.length}) `;
  }

  //* For the following possible options, first check to see if queryParams contains anything
  //* if so, use AND before query option; if not, use WHERE since it is first option
  // if user selects owner_id in options, append it to queryString
  if (options.owner_id && queryParams.length > 0) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length}`;
  }
  if (options.owner_id && queryParams.length === 0) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }

  // if user selects minimum_price_per_night in options, append it to queryString
  if (options.minimum_price_per_night && queryParams.length > 0) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }
  if (options.minimum_price_per_night && queryParams.length === 0) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `WHERE cost_per_night >= $${queryParams.length} `;
  }

  // if user selects maximum_price_per_night in options, append it to queryString
  if (options.maximum_price_per_night && queryParams.length > 0) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `AND cost_per_night <= $${queryParams.length}`;
  }
  if (options.maximum_price_per_night && queryParams.length === 0) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `WHERE cost_per_night <= $${queryParams.length} `;
  }

  // Append the GROUP BY statement to queryString
  queryString += `
  GROUP BY properties.id
  `;

  // if user selects minimum_rating in options, append it to queryString with HAVING clause
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // order by cost_per_night and append the limit to queryString
  console.log("limit before push:", limit);
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then((result) => result.rows)


};


exports.getAllProperties = getAllProperties;




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const queryParams = [
    property.title,
    property.description,
    property.owner_id,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property. number_of_bathrooms,
    property.number_of_bedrooms,
    property.province,
    property.city,
    property.country,
    property.street,
    property.post_code,
  ];

  let queryString = `
  INSERT INTO PROPERTIES (title, description, owner_id, thumbnail_photo_url,
    cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,
    number_of_bedrooms, province, city, country, street, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`;

  return pool.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error(err);
      throw err;
    })
}

exports.addProperty = addProperty;


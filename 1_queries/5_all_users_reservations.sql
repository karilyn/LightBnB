SELECT reservations.id, title, start_date, cost_per_night, avg(property_reviews.rating) as average_rating
FROM properties
JOIN reservations on properties.id = reservations.property_id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY reservations.id, properties.id
ORDER BY start_date;

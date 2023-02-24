$(() => {
  getAllListings()
    .then(function( json ) {
    propertyListings.addProperties(json.properties);
    views_manager.show('listings')
    .catch((err) => {
      console.error(err);
      throw err;
    })
  });
});


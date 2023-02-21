$(() => {
  getAllListings().then(function( json ) {
    propertyListings.addProperties(json.properties);
    views_manager.show('listings');
  });
});

//* ^^^ there needs to be a catch up here because if it fails it
//* will be an uncaught promise error
//* we might want to just turn the variable in addProperties into properties instead of json.properties
/*
 Created on.
*/







// If the object exists, geolocation services are available. You can test for the presence of geolocation with this code:

if ("geolocation" in navigator) {
  /* geolocation is available */
} else {
  /* geolocation IS NOT available */
}




// To obtain the user's current location, you can call the getCurrentPosition() method.

navigator.geolocation.getCurrentPosition(function(position) {
  do_something(position.coords.latitude, position.coords.longitude);
});
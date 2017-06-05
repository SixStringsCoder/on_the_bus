/*
 Created on.
*/


alert("It worked");

// AJAX request
var data

$.ajax({
    url: 'https://developer.trimet.org/ws/V1/stops?appID=DD56C4E4A2D654695936E059E&json=true&ll=-122.674731, 45.502257&meters=100m',
    method: 'POST',
    data: {'appID': 'DD56C4E4A2D654695936E059E',
            'json': 'true',
            'll': '-122.674731, 45.502257',
            'meters': '100'},
    success: function(response){
        console.log(response);
        data = response;
    },
    error: function(error){
        console.log(error);
    }
});


//
// // If the object exists, geolocation services are available. You can test for the presence of geolocation with this code:
//
// if ("geolocation" in navigator) {
//   /* geolocation is available */
// } else {
//   /* geolocation IS NOT available */
// }
//
//
//
//
// // To obtain the user's current location, you can call the getCurrentPosition() method.
//
// navigator.geolocation.getCurrentPosition(function(position) {
//   do_something(position.coords.latitude, position.coords.longitude);
// });
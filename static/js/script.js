/*
 Created on.
*/


// Declare Closure Variables
let map;


function fetch(here){
    // AJAX request
    let data;

    let lat = here.coords.latitude;
    let long = here.coords.longitude;


    //Object Request
    let req_params = {'appID': 'DD56C4E4A2D654695936E059E',
                      'json': 'true',
                      'll': `${lat}, ${long}`,
                      'meters': '1000'};

    $.ajax({
        url: 'https://developer.trimet.org/ws/V1/stops?appID=DD56C4E4A2D654695936E059E&json=true&ll=-122.674731, 45.502257&meters=100m',
        method: 'POST',
        data: req_params,
        success: function(response){
            console.log(response);
            data = response;
        },
        error: function(error){
            console.log(error);
        }
    });
}



function initMap(position) {
        let here = {lat: position.coords.latitude, lng: position.coords.longitude};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 18,
          center: here
        });
        var marker = new google.maps.Marker({
          position: here,
          map: map
        });
      }


function getPosition() {
    // If the object exists, geolocation services are available. You can test for the presence of geolocation with this code:
    if ("geolocation" in navigator) {
        /* geolocation is available */
        //To obtain the user's current location, you can call the getCurrentPosition() method.
        navigator.geolocation.getCurrentPosition(function (position) {
            // Call Google Init Function for MAP and MARKER
            initMap(position);
        });
    } else {
        /* geolocation IS NOT available */
        alert("No location available");
    }
}